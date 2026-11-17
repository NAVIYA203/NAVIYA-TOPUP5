import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/PageHero";
import { verifyFreeFireId } from "@/lib/ff.functions";
import { isValidUid } from "@/lib/ff";
import { FF_DIAMONDS, FF_MEMBERSHIPS, formatLkr, whatsappLink, type FfPackage } from "@/lib/site";

export const Route = createFileRoute("/freefire")({
  validateSearch: (s: Record<string, unknown>): { uid?: string | undefined } => {
    const uid = s["uid"];
    return { uid: typeof uid === "string" && /^\d{5,20}$/.test(uid) ? uid : undefined };
  },
  head: () => ({
    meta: [
      { title: "Free Fire Diamonds & Memberships in LKR | NAVIYA TOPUP" },
      { name: "description", content: "Buy Free Fire diamonds, bonus packs and memberships in Sri Lankan rupees. Verify your Player ID first." },
      { property: "og:title", content: "Free Fire Top-ups | NAVIYA TOPUP" },
      { property: "og:description", content: "Free Fire diamonds and memberships in LKR with Player ID verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FreeFirePage,
});

function FreeFirePage() {
  const { uid: initialUid } = Route.useSearch();
  const [uid, setUid] = useState(initialUid ?? "");
  const [verified, setVerified] = useState<{ uid: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const verify = useServerFn(verifyFreeFireId);
  const mutation = useMutation({
    mutationFn: (v: string) => verify({ data: { uid: v } }),
    onSuccess: (r, v) => {
      if (r.ok) {
        setVerified({ uid: v, name: r.playerName });
        setError(null);
      } else {
        setVerified(null);
        setError(r.error);
      }
    },
    onError: () => setError("Verification service unavailable. Please try again later."),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = uid.trim();
    setVerified(null);
    if (!isValidUid(clean)) return setError("Please enter a valid numeric Player UID.");
    setError(null);
    mutation.mutate(clean);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader action={<Link to="/checkout" search={{ category: "Free Fire" }} className="btn btn-primary hidden sm:inline-flex">Place Order</Link>} />
      <PageHero title="🔥 Free Fire Top-ups">Choose a membership or diamond package. Prices are in LKR (Rs.).</PageHero>
      <section className="py-12 md:py-16">
        <div className="wrap">
          <div className="notice mb-6">Please confirm current stock and price with NAVIYA TOPUP before paying.</div>

          <div className="surface mb-8 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="mark h-9 w-9 text-sm">1</span>
              <div>
                <h2 className="text-[22px] font-black">Verify Your Free Fire Player ID</h2>
                <span className="text-[13px] text-muted-foreground">Enter your UID and verify it before selecting a package.</span>
              </div>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="playerUid" className="field-label">Free Fire Player ID (UID) *</label>
                <input
                  id="playerUid"
                  className="field-input"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Enter your Free Fire Player ID (UID)"
                  value={uid}
                  onChange={(e) => { setUid(e.target.value.replace(/\D/g, "")); setVerified(null); }}
                  maxLength={20}
                />
              </div>
              <button className="btn btn-primary h-[52px]" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <><span className="spin" /> Verifying...</> : "✓ Verify Player ID"}
              </button>
            </form>
            <div role="status" className="mt-3 text-sm font-semibold">
              {verified ? (
                <div className="rounded-xl bg-success-soft p-3.5 font-extrabold text-success">
                  ✓ Verified — Player: {verified.name} — UID: {verified.uid}
                </div>
              ) : error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                <span className="text-muted-foreground">
                  Player ID verification is required before ordering. Want full player details?{" "}
                  <Link to="/freefire-info" className="text-brand underline">Use the FF Info Bot</Link>.
                </span>
              )}
            </div>
          </div>

          <PackageGrid kicker="MEMBERSHIPS" title="Free Fire Membership Packages" items={FF_MEMBERSHIPS} verified={verified} />
          <div className="h-12" />
          <PackageGrid kicker="DIAMOND PACKAGES" title="Free Fire Diamonds" items={FF_DIAMONDS} verified={verified} />

          <div className="banner-strip mt-11 flex flex-col items-start justify-between gap-5 rounded-2xl p-7 md:flex-row md:items-center">
            <div>
              <h3 className="mb-1.5 text-xl font-bold">Need another Free Fire package?</h3>
              <p className="text-sm text-on-dark-muted">Message us to check the latest availability.</p>
            </div>
            <a className="btn btn-light" href={whatsappLink("Hi NAVIYA TOPUP, I need a Free Fire top-up.")} target="_blank" rel="noopener">CHAT ON WHATSAPP ↗</a>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function PackageGrid({ kicker, title, items, verified }: { kicker: string; title: string; items: FfPackage[]; verified: { uid: string; name: string } | null }) {
  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <span className="kicker">{kicker}</span>
          <h2 className="mt-1.5 text-3xl font-black tracking-tight">{title}</h2>
        </div>
        <span className="text-[13px] text-muted-foreground">Currency: LKR (Rs.)</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <article key={p.name} className="surface flex min-h-[220px] flex-col rounded-2xl p-3 sm:p-4">
            <div className="mb-3 grid h-[105px] place-items-center rounded-xl bg-accent text-5xl">{p.art}</div>
            <span className="mb-2.5 w-max rounded-full bg-accent px-2.5 py-1 text-[10px] font-black text-brand">{p.label}</span>
            <h3 className="mb-2 min-h-[45px] text-base font-bold leading-snug">{p.name}</h3>
            <div className="mb-3.5 text-lg font-black text-brand">{formatLkr(p.price)}</div>
            {verified ? (
              <Link
                to="/checkout"
                search={{ category: "Free Fire", product: p.name, playerId: verified.uid, playerName: verified.name }}
                className="btn btn-primary mt-auto w-full text-[13px]"
              >
                Order this package
              </Link>
            ) : (
              <span className="btn btn-primary mt-auto w-full text-[13px]" aria-disabled="true">Verify ID first</span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
