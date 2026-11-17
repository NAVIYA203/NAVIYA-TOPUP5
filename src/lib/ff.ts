// Shared Free Fire helpers (safe for browser and server).

export const FF_REGIONS = {
  SG: "Singapore / Sri Lanka",
  IND: "India",
  BD: "Bangladesh",
  PK: "Pakistan",
  ID: "Indonesia",
  TH: "Thailand",
  BR: "Brazil",
  US: "USA",
  NA: "North America",
  SAC: "South America",
} as const;

export type FfRegion = keyof typeof FF_REGIONS;

export const isValidUid = (uid: string) => /^[0-9]{5,20}$/.test(uid.trim());
export const isValidRegion = (r: string): r is FfRegion => r in FF_REGIONS;

const BR_RANKS: [string, number, number][] = [
  ["Bronze I", 700, 800], ["Bronze II", 801, 900], ["Bronze III", 901, 1000],
  ["Silver I", 1001, 1100], ["Silver II", 1101, 1200], ["Silver III", 1201, 1300],
  ["Gold I", 1301, 1400], ["Gold II", 1401, 1500], ["Gold III", 1501, 1600], ["Gold IV", 1601, 1800],
  ["Platinum I", 1801, 1900], ["Platinum II", 1901, 2000], ["Platinum III", 2001, 2100], ["Platinum IV", 2101, 2300],
  ["Diamond I", 2301, 2400], ["Diamond II", 2401, 2500], ["Diamond III", 2501, 2600], ["Diamond IV", 2601, 3200],
  ["Heroic", 3201, 6000], ["Master", 6001, 999999],
];

const CS_RANKS: [string, number, number][] = [
  ["Bronze I", 0, 2], ["Bronze II", 3, 5], ["Bronze III", 6, 8],
  ["Silver I", 9, 12], ["Silver II", 13, 16], ["Silver III", 17, 20],
  ["Gold I", 21, 25], ["Gold II", 26, 30], ["Gold III", 31, 35], ["Gold IV", 36, 40],
  ["Platinum I", 41, 45], ["Platinum II", 46, 50], ["Platinum III", 51, 55], ["Platinum IV", 56, 60],
  ["Diamond I", 61, 65], ["Diamond II", 66, 70], ["Diamond III", 71, 75], ["Diamond IV", 76, 80], ["Diamond V", 81, 85],
  ["Heroic", 86, 110], ["Elite Heroic", 111, 135], ["Master", 136, 999999],
];

function lookup(table: [string, number, number][], value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (value === null || value === undefined || value === "" || !Number.isFinite(n)) return "Unranked";
  const hit = table.find(([, min, max]) => n >= min && n <= max);
  return hit ? hit[0] : "Unranked";
}

/** BR rank name from rank points (same table as the Python bot). */
export const brRankName = (points: unknown) => lookup(BR_RANKS, points);
/** CS rank name from CS points/stars (same table as the Python bot). */
export const csRankName = (stars: unknown) => lookup(CS_RANKS, stars);

export const formatFfDate = (unixSeconds: string | number | null | undefined) => {
  if (!unixSeconds) return "—";
  const n = Number(unixSeconds);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return new Date(n * 1000).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export const cleanEnum = (v: string | null | undefined) =>
  v ? v.replace(/^(Gender|Language|RankShow)_/, "").replace(/_/g, " ") : "—";

export type FfItem = { id: string; name: string | null; image: string | null; rare: string | null };

export type FfPlayer = {
  uid: string;
  name: string;
  region: string;
  level: number | null;
  exp: number | null;
  likes: number | null;
  primeLevel: number | null;
  seasonId: number | null;
  createdAt: string | null;
  lastLogin: string | null;
  releaseVersion: string | null;
  signature: string | null;
  gender: string | null;
  language: string | null;
  creditScore: number | null;
  br: { points: number | null; rank: string; maxRankCode: number | null; visible: boolean };
  cs: { points: number | null; rank: string; maxRankCode: number | null; visible: boolean };
  guild: null | {
    id: string; name: string; level: number | null; members: number | null; capacity: number | null;
    ownerName: string | null; ownerLevel: number | null; ownerUid: string | null;
  };
  pet: null | { name: string | null; level: number | null; exp: number | null; skin: FfItem | null };
  avatar: FfItem | null;
  banner: FfItem | null;
  title: FfItem | null;
  badges: number | null;
  outfit: FfItem[];
  weapons: FfItem[];
};

export type FfLookupResult = { ok: true; player: FfPlayer } | { ok: false; error: string };
export type FfVerifyResult =
  | { ok: true; playerName: string; region: string | null; uid: string }
  | { ok: false; error: string };
