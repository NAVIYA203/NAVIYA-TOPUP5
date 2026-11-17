import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Logo } from "@/components/site/SiteHeader";
import { PageHero } from "@/components/site/PageHero";
import { ORDER_CATEGORIES, whatsappLink } from "@/lib/site";

type Search = { category?: string | undefined; product?: string | undefined; playerId?: string | undefined; playerName?: string | undefined };
const s = (v: unknown) => (typeof v === "string" && v.length <= 120 ? v : undefined);

export const Route = createFileRoute("/checkout")({
  validateSearch: (q: Record<string, unknown>): Search => ({
    category: s(q["category"]), product: s(q["product"]), playerId: s(q["playerId"]), playerName: s(q["playerName"]),
  }),
  head: () => ({
    meta: [
      { title: "Place an Order on WhatsApp | NAVIYA TOPUP" },
      { name: "description", content: "Send your top-up or gift card order enquiry to NAVIYA TOPUP on WhatsApp." },
      { property: "og:title", content: "Place an Order | NAVIYA TOPUP" },
      { property: "og:description", content: "Order enquiry form — sent to NAVIYA TOPUP on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const q = Route.useSearch();
  const [f, setF] = useState({
    name: "", phone: "", category: q.category ?? "", product: q.product ?? "",
    player: q.playerId ? `${q.playerId}${q.playerName ? ` (${q.playerName})` : ""}` : "", qty: "1", notes: "",
  });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((o) => ({ ...o, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = [
      "NAVIYA TOPUP - Order Enquiry",
      `Name: ${f.name}`, `Customer WhatsApp: ${f.phone}`, `Category: ${f.category}`, `Product: ${f.product}`,
      `Player ID / Region: ${f.player}`, `Quantity: ${f.qty}`, `Notes: ${f.notes}`,
    ].join("\n");
    window.open(whatsappLink(msg), "_blank", "noopener");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 h-[66px] border-b border-border bg-background/90 backdrop-blur-md md:h-[76px]">
        <div className="wrap flex h-full items-center justify-between">
          <Logo />
          <Link to="/catalog" className="btn btn-light">← Back to products</Link>
        </div>
      </header>
      <PageHero title="Place an Order">Send your order enquiry to NAVIYA TOPUP via WhatsApp.</PageHero>
      <div className="wrap max-w-[820px] py-9 pb-20">
        <div className="surface p-6">
          <div className="notice mb-5">This is an enquiry form, not an online payment checkout. We will confirm availability, final price and payment instructions with you before processing.</div>
          <form onSubmit={onSubmit}>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <F label="Your name *" id="name"><input id="name" className="field-input" required value={f.name} onChange={set("name")} placeholder="Enter your name" /></F>
              <F label="WhatsApp number *" id="phone"><input id="phone" className="field-input" required value={f.phone} onChange={set("phone")} placeholder="e.g. 07XXXXXXXX" /></F>
              <F label="Product category *" id="category">
                <select id="category" className="field-input" required value={f.category} onChange={set("category")}>
                  <option value="">Select category</option>
                  {ORDER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </F>
              <F label="Product / amount wanted" id="product"><input id="product" className="field-input" value={f.product} onChange={set("product")} placeholder="e.g. 100 Diamonds" /></F>
              <F label="Player ID / region (if applicable)" id="player"><input id="player" className="field-input" value={f.player} onChange={set("player")} placeholder="Enter required game details" /></F>
              <F label="Quantity" id="qty"><input id="qty" type="number" min={1} className="field-input" value={f.qty} onChange={set("qty")} /></F>
              <div className="sm:col-span-2">
                <F label="Additional notes" id="notes"><textarea id="notes" rows={3} className="field-input" value={f.notes} onChange={set("notes")} placeholder="Any extra information..." /></F>
              </div>
            </div>
            <p className="my-4 text-[13px] leading-6 text-muted-foreground">Please double-check your player ID and region. Do not enter passwords, OTP codes or payment card details.</p>
            <button className="btn btn-primary" type="submit">Send Order Enquiry on WhatsApp ↗</button>
          </form>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function F({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
    </div>
  );
}
