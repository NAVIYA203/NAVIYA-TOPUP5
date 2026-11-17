import { createServerFn } from "@tanstack/react-start";
import {
  brRankName,
  csRankName,
  isValidRegion,
  isValidUid,
  type FfItem,
  type FfLookupResult,
  type FfPlayer,
  type FfVerifyResult,
} from "@/lib/ff";

const GAMESKINBO_URL = "https://api.gameskinbo.com/ff-info/get";
const VOLSEVER_URL = "https://gate.volsever.com/proxy/api/game/free-fire-get-session-key-sg";

const ICONS_G = "https://raw.githubusercontent.com/ilanzera/ff-items-database-ptbr/main/assets/icons/";
const ICONS_S = "https://cdn-sc-g.sharechat.com/33d5318_1c8/";

type ItemMap = Record<string, [string, (string | null)?, (string | null)?]>;
let itemMapPromise: Promise<ItemMap> | null = null;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : v != null && v !== "" && Number.isFinite(Number(v)) ? Number(v) : null);
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

function toItem(items: ItemMap, id: unknown): FfItem | null {
  if (id === null || id === undefined || id === "" || id === 0) return null;
  const key = String(id);
  const hit = items[key];
  if (!hit) return { id: key, name: null, image: null, rare: null };
  const [u, name, rare] = hit;
  const image = u.startsWith("g") ? ICONS_G + u.slice(1) : u.startsWith("s") ? ICONS_S + u.slice(1) : u;
  return { id: key, name: name ?? null, image, rare: rare ?? null };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Upstream = any;

async function fetchGamesKinbo(uid: string, region: string): Promise<{ ok: true; data: Upstream } | { ok: false; error: string }> {
  const key = process.env["GAMESKINBO_API_KEY"];
  if (!key) return { ok: false, error: "Info Bot is not configured yet. Please try again later." };
  const url = new URL(GAMESKINBO_URL);
  url.searchParams.set("uid", uid);
  url.searchParams.set("region", region);
  let res: Response;
  try {
    res = await fetch(url.toString(), { headers: { "x-api-key": key, Accept: "application/json" } });
  } catch {
    return { ok: false, error: "Could not reach the player info service. Please try again." };
  }
  let data: Upstream | null = null;
  try {
    data = (await res.json()) as Upstream;
  } catch {
    return { ok: false, error: "The player info service returned an unreadable response." };
  }
  if (!res.ok) {
    if (res.status === 429) return { ok: false, error: "Too many lookups right now. Please wait a moment and try again." };
    if (res.status === 401 || res.status === 403) return { ok: false, error: "The player info service is temporarily unavailable." };
    if (res.status === 404 || res.status === 402) return { ok: false, error: "Player not found. Check the UID and region." };
    return { ok: false, error: "Could not retrieve player information. Please try again." };
  }
  if (!data || typeof data !== "object" || !data.AccountInfo) {
    return { ok: false, error: "Player not found. Check the UID and region." };
  }
  return { ok: true, data };
}

export const getFreeFirePlayer = createServerFn({ method: "POST" })
  .inputValidator((input: { uid: string; region: string }) => {
    const uid = String(input?.uid ?? "").trim();
    const region = String(input?.region ?? "SG").trim().toUpperCase();
    return { uid, region };
  })
  .handler(async ({ data }): Promise<FfLookupResult> => {
    if (!isValidUid(data.uid)) return { ok: false, error: "Enter a valid numeric Free Fire UID (5–20 digits)." };
    if (!isValidRegion(data.region)) return { ok: false, error: "Please choose a supported region." };

    const upstream = await fetchGamesKinbo(data.uid, data.region);
    if (!upstream.ok) return upstream;

    const d = upstream.data;
    const a = d.AccountInfo ?? {};
    const p = d.AccountProfileInfo ?? {};
    const eq = d.EquippedItemsInfo ?? {};
    const s = d.SocialInfo ?? {};
    const g = d.GuildInfo ?? null;
    const go = d.GuildOwnerInfo ?? null;
    const pet = d.PetInfo ?? null;
    // Loaded lazily inside the server handler, so the big item list never reaches the browser.
    itemMapPromise ??= import("@/server/ff-items.json").then((m) => (m.default ?? m) as unknown as ItemMap);
    const items = await itemMapPromise;

    const player: FfPlayer = {
      uid: str(s.accountId) ?? data.uid,
      name: str(a.AccountName) ?? "Unknown Player",
      region: str(a.AccountRegion) ?? data.region,
      level: num(a.AccountLevel),
      exp: num(a.AccountEXP),
      likes: num(a.AccountLikes),
      primeLevel: num(a.PrimeLevel),
      seasonId: num(a.AccountSeasonId),
      createdAt: str(String(a.AccountCreateTime ?? "")),
      lastLogin: str(String(a.AccountLastLogin ?? "")),
      releaseVersion: str(d.ReleaseVersion),
      signature: str(s.signature),
      gender: str(s.gender),
      language: str(s.language),
      creditScore: num(d.CreditScoreInfo?.creditScore),
      br: { points: num(p.BrRankPoint), rank: brRankName(p.BrRankPoint), maxRankCode: num(p.BrMaxRank), visible: p.ShowBrRank !== false },
      cs: { points: num(p.CsRankPoint), rank: csRankName(p.CsRankPoint), maxRankCode: num(p.CsMaxRank), visible: p.ShowCsRank !== false },
      guild: g && (g.GuildID || g.GuildName)
        ? {
            id: String(g.GuildID ?? ""),
            name: str(g.GuildName) ?? "—",
            level: num(g.GuildLevel),
            members: num(g.GuildMember),
            capacity: num(g.GuildCapacity),
            ownerName: str(go?.nickname),
            ownerLevel: num(go?.level),
            ownerUid: str(String(g.GuildOwner ?? go?.accountId ?? "")),
          }
        : null,
      pet: pet ? { name: str(pet.name), level: num(pet.level), exp: num(pet.exp), skin: toItem(items, pet.skinId) } : null,
      avatar: toItem(items, eq.EquippedAvatarId),
      banner: toItem(items, eq.EquippedBannerId),
      title: toItem(items, p.Title),
      badges: num(eq.EquippedBPBadges),
      outfit: (Array.isArray(eq.EquippedOutfit) ? eq.EquippedOutfit : []).map((id: unknown) => toItem(items, id)).filter(Boolean) as FfItem[],
      weapons: (Array.isArray(eq.EquippedWeapon) ? eq.EquippedWeapon : []).map((id: unknown) => toItem(items, id)).filter(Boolean) as FfItem[],
    };
    return { ok: true, player };
  });

/**
 * Verifies a Player ID before ordering. Uses the Volsever verification service when its key
 * is configured, otherwise falls back to the Games Kinbo info lookup.
 */
export const verifyFreeFireId = createServerFn({ method: "POST" })
  .inputValidator((input: { uid: string }) => ({ uid: String(input?.uid ?? "").trim() }))
  .handler(async ({ data }): Promise<FfVerifyResult> => {
    if (!isValidUid(data.uid)) return { ok: false, error: "Enter a valid numeric Free Fire Player UID." };

    const volKey = process.env["VOLSEVER_API_KEY"];
    if (volKey) {
      try {
        const url = new URL(VOLSEVER_URL);
        url.searchParams.set("id", data.uid);
        const res = await fetch(url.toString(), { headers: { "X-API-Key": volKey, Accept: "application/json" } });
        const body = (await res.json().catch(() => null)) as Upstream | null;
        const name = str(body?.data?.username);
        if (res.ok && body?.status === true && name) {
          // Never forward session_key or other private upstream fields.
          return { ok: true, playerName: name, region: str(body?.data?.region), uid: data.uid };
        }
        if (res.status === 404 || body?.status === false) return { ok: false, error: "Player ID not found. Please check your UID." };
      } catch {
        // fall through to Games Kinbo
      }
    }

    const upstream = await fetchGamesKinbo(data.uid, "SG");
    if (!upstream.ok) return upstream;
    const name = str(upstream.data.AccountInfo?.AccountName);
    if (!name) return { ok: false, error: "Player ID could not be verified. Please check your UID." };
    return { ok: true, playerName: name, region: str(upstream.data.AccountInfo?.AccountRegion), uid: data.uid };
  });
