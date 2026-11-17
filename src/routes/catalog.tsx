import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero, SectionHead } from "@/components/site/PageHero";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Products — Game Top-ups & Gift Cards | NAVIYA TOPUP" },
      { name: "description", content: "Browse game top-ups (Free Fire, PUBG Mobile, Mobile Legends), gift cards and digital game keys." },
      { property: "og:title", content: "Product Categories | NAVIYA TOPUP" },
      { property: "og:description", content: "Game top-ups, gift cards and game keys from NAVIYA TOPUP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

type P = { tag: string; title: string; text: string; category?: string; ff?: boolean };
const GROUPS: { id: string; kicker: string; title: string; text: string; items: P[] }[] = [
  {
    id: "topups", kicker: "Category 01", title: "Game Top-ups",
    text: "Popular game top-up categories. Exact denominations and supported regions are confirmed on order.",
    items: [
      { tag: "Game top-up", title: "🎮 PUBG Mobile", text: "UC packages · Player ID and region may be required.", category: "PUBG Mobile" },
      { tag: "Featured game top-up", title: "🔥 Free Fire Diamonds", text: "Memberships and diamond packages. View the package list and prices.", ff: true },
      { tag: "Game top-up", title: "⚔️ Mobile Legends", text: "Diamond packages · Player details may be required.", category: "Mobile Legends" },
    ],
  },
  {
    id: "giftcards", kicker: "Category 02", title: "Gift Cards",
    text: "Digital gift card categories, subject to region and current stock.",
    items: [
      { tag: "Digital gift card", title: "🎁 Steam Wallet", text: "Available currencies and denominations to be confirmed.", category: "Steam Wallet" },
      { tag: "Digital gift card", title: "🍎 Apple Gift Card", text: "Region restrictions may apply. Confirm before payment.", category: "Apple Gift Card" },
      { tag: "Digital gift card", title: "▶️ Google Play", text: "Region and denomination availability to be confirmed.", category: "Google Play" },
    ],
  },
  {
    id: "gamekeys", kicker: "Category 03", title: "Game Keys & Other Digital Products",
    text: "More digital products may be available on request.",
    items: [
      { tag: "Digital key", title: "🕹️ PC / Console Game Keys", text: "Platform and region restrictions must be checked.", category: "Game Keys" },
      { tag: "Digital service", title: "✨ Other Digital Services", text: "Ask our team about supported services.", category: "Other Services" },
    ],
  },
];

function CatalogPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader action={<Link to="/checkout" className="btn btn-primary hidden sm:inline-flex">Place an Order</Link>} />
      <PageHero title="Product Categories">Choose a category and contact us to confirm the current products, region and price.</PageHero>
      <section className="py-12 md:py-16">
        <div className="wrap space-y-16">
          {GROUPS.map((g) => (
            <div key={g.id} id={g.id}>
              <SectionHead kicker={g.kicker} title={g.title}>{g.text}</SectionHead>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((p) => (
                  <article key={p.title} className="surface surface-hover flex flex-col rounded-2xl p-5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-brand">{p.tag}</span>
                    <h3 className="my-2 text-lg font-bold">{p.title}</h3>
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">{p.text}</p>
                    {p.ff ? (
                      <Link to="/freefire" className="btn btn-primary mt-auto">View Free Fire Packages →</Link>
                    ) : (
                      <Link to="/checkout" search={{ category: p.category }} className="btn btn-primary mt-auto">Enquire / Order →</Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
