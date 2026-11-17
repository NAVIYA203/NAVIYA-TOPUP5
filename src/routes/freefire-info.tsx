import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent, type ReactNode } from "react";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { getFreeFirePlayer } from "@/lib/ff.functions";
import { cleanEnum, FF_REGIONS, formatFfDate, isValidUid, type FfItem, type FfPlayer, type FfRegion } from "@/lib/ff";

export const Route = createFileRoute("/freefire-info")({
  head: () => ({
    meta: [
      { title: "Free Fire Info Bot — Player UID Lookup | NAVIYA TOPUP" },
      { name: "description", content: "Enter a Free Fire Player UID to see level, likes, BR & CS rank, guild, pet and equipped items." },
      { property: "og:title", content: "Free Fire Info Bot | NAVIYA TOPUP" },
      { property: "og:description", content: "Free Fire player lookup: level, likes, ranks, guild and equipped items from a UID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InfoBotPage,
});

const n = (v: number | null | undefined) => (v === null || v === undefined ? "—" : v.toLocaleString("en-US"));

function InfoBotPage() {
  const [uid, setUid] = useState("");
  const [region, setRegion] = useState<FfRegion>("SG");
  const [formError, setFormError] = useState<string | null>(null);
  const lookup = useServerFn(getFreeFirePlayer);
  const mutation = useMutation({ mutationFn: (v: { uid: string; region: string }) => lookup({ data: v }) });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = uid.trim();
    if (!isValidUid(clean)) {
      setFormError("Please enter a valid numeric UID (5–20 digits).");
      return;
    }
    setFormError(null);
    mutation.mutate({ uid: clean, region });
  };

  const result = mutation.data;
  const error = formError ?? (mutation.isError ? "Something went wrong. Please try again." : result && !result.ok ? result.error : null);

  return (
    <div className="min-h-screen">
      <SiteHeader action={<Link to="/freefire" className="btn btn-primary hidden sm:inline-flex">Buy Diamonds ↗</Link>} />
      <PageHero title="🤖 Free Fire Info Bot">
        Enter a Player UID to view the public player profile, ranks, guild and equipped items.
      </PageHero>

      <section className="py-12 md:py-16">
        <div className="wrap max-w-[960px]">
          <div className="surface p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="mark text-sm">FF</span>
              <div>
                <h2 className="text-[23px] font-black">Player Lookup</h2>
                <span className="text-[13px] text-muted-foreground">Free Fire account information</span>
              </div>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[1fr_190px_auto]">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="uid" className="field-label">Player UID *</label>
                <input
                  id="uid"
                  className="field-input"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="e.g. 2805365702"
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/\D/g, ""))}
                  maxLength={20}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="region" className="field-label">Region</label>
                <select id="region" className="field-input" value={region} onChange={(e) => setRegion(e.target.value as FfRegion)}>
                  {Object.entries(FF_REGIONS).map(([k, v]) => (
                    <option key={k} value={k}>{k} — {v}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary col-span-2 h-[52px] sm:col-span-1" disabled={mutation.isPending}>
                {mutation.isPending ? <><span className="spin" /> Searching...</> : <><Search size={16} /> Find Player</>}
              </button>
            </form>
            <div role="status" aria-live="polite" className="mt-3.5 min-h-6 text-sm font-bold">
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : mutation.isPending ? (
                <span className="text-muted-foreground">Contacting player info service...</span>
              ) : result?.ok ? (
                <span className="text-success">✓ Player information loaded successfully.</span>
              ) : (
                <span className="text-muted-foreground">Enter a UID and choose its region to search. Sri Lanka players use SG.</span>
              )}
            </div>
          </div>

          {result?.ok && <PlayerProfile player={result.player} />}

          <p className="mt-5 text-[13px] leading-7 text-muted-foreground">
            Player information is provided by the external Games Kinbo API and may be unavailable if its service or usage
            limit is reached. NAVIYA TOPUP never asks for your game password or login details.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function PlayerProfile({ player: p }: { player: FfPlayer }) {
  return (
    <div className="fade-up mt-6 space-y-3.5">
      <div className="profile-strip relative overflow-hidden rounded-2xl">
        <div className="relative flex flex-wrap items-center gap-4 p-6">
          <div className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-on-dark/10 text-4xl">
            {p.avatar?.image ? <img src={p.avatar.image} alt={p.avatar.name ?? "Avatar"} className="h-full w-full object-cover" /> : "🎮"}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-black">{p.name}</h2>
            <p className="mt-1 text-sm text-on-dark-muted">
              UID {p.uid} · {p.region}
              {p.title?.name ? ` · ${p.title.name}` : ""}
            </p>
            {p.signature && <p className="mt-2 text-sm italic text-on-dark-muted">“{p.signature}”</p>}
          </div>
          <Link to="/freefire" search={{ uid: p.uid }} className="btn btn-light">💎 Top up this ID</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="ACCOUNT LEVEL" value={n(p.level)} />
        <Stat label="LIKES" value={n(p.likes)} />
        <Stat label="BR RANK" value={p.br.rank} sub={`${n(p.br.points)} pts`} />
        <Stat label="CS RANK" value={p.cs.rank} sub={`${n(p.cs.points)} pts`} />
      </div>

      <Block title="👤 Account Information">
        <Detail label="Account EXP" value={n(p.exp)} />
        <Detail label="Prime Level" value={n(p.primeLevel)} />
        <Detail label="Season ID" value={n(p.seasonId)} />
        <Detail label="Game Version" value={p.releaseVersion ?? "—"} />
        <Detail label="Account Created" value={formatFfDate(p.createdAt)} />
        <Detail label="Last Login" value={formatFfDate(p.lastLogin)} />
        <Detail label="Credit Score" value={n(p.creditScore)} />
        <Detail label="BP Badges" value={n(p.badges)} />
        <Detail label="Gender" value={cleanEnum(p.gender)} />
        <Detail label="Language" value={cleanEnum(p.language)} />
      </Block>

      <Block title="🏆 Rank Information">
        <Detail label="BR Rank" value={p.br.rank} />
        <Detail label="BR Rank Points" value={n(p.br.points)} />
        <Detail label="CS Rank" value={p.cs.rank} />
        <Detail label="CS Rank Points" value={n(p.cs.points)} />
      </Block>

      {p.guild && (
        <Block title="🛡️ Guild Information">
          <Detail label="Guild Name" value={p.guild.name} />
          <Detail label="Guild ID" value={p.guild.id || "—"} />
          <Detail label="Guild Level" value={n(p.guild.level)} />
          <Detail label="Members" value={p.guild.members != null ? `${p.guild.members}${p.guild.capacity ? ` / ${p.guild.capacity}` : ""}` : "—"} />
          <Detail label="Guild Leader" value={p.guild.ownerName ?? "—"} />
          <Detail label="Leader Level" value={n(p.guild.ownerLevel)} />
        </Block>
      )}

      {p.pet && (
        <Block title="🐾 Pet Information">
          <Detail label="Pet Name" value={p.pet.name ?? "—"} />
          <Detail label="Pet Level" value={n(p.pet.level)} />
          <Detail label="Pet EXP" value={n(p.pet.exp)} />
          <Detail label="Pet Skin" value={p.pet.skin?.name ?? "—"} />
        </Block>
      )}

      {(p.outfit.length > 0 || p.weapons.length > 0) && (
        <div className="surface p-5">
          <h3 className="mb-4 text-lg font-bold">✨ Equipped Items</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {[p.avatar, p.banner, ...p.outfit, ...p.weapons, p.pet?.skin ?? null]
              .filter((i): i is FfItem => !!i)
              .map((item, idx) => (
                <ItemTile key={`${item.id}-${idx}`} item={item} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ItemTile({ item }: { item: FfItem }) {
  return (
    <div className={`item-tile rarity-${item.rare ?? "NONE"}`} title={item.name ?? item.id}>
      <div className="grid aspect-square place-items-center bg-background p-2">
        {item.image ? (
          <img src={item.image} alt={item.name ?? item.id} className="max-h-full max-w-full object-contain" loading="lazy" />
        ) : (
          <span className="text-2xl">🎁</span>
        )}
      </div>
      <p className="truncate px-2 py-1.5 text-[11px] font-semibold">{item.name ?? item.id}</p>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="surface rounded-xl p-4 shadow-none">
      <small className="block text-xs font-bold text-muted-foreground">{label}</small>
      <b className="mt-1 block break-words text-xl">{value}</b>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="surface p-5">
      <h3 className="mb-3.5 text-lg font-bold">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted px-3 py-2.5">
      <small className="block text-[11px] text-muted-foreground">{label}</small>
      <b className="mt-0.5 block break-words">{value}</b>
    </div>
  );
}
