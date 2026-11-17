import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionHead } from "@/components/site/PageHero";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";
import emblemUrl from "@/assets/naviya-emblem.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NAVIYA TOPUP | Game Top-ups & Digital Goods" },
      { name: "description", content: "Free Fire diamonds, game top-ups, gift cards and a Free Fire player info bot — NAVIYA TOPUP, Sri Lanka." },
      { property: "og:title", content: "NAVIYA TOPUP | Power up your game" },
      { property: "og:description", content: "Free Fire diamonds, game top-ups, gift cards and a Free Fire player info bot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const CATEGORIES = [
  { icon: "🔥", title: "Free Fire Diamonds", text: "Memberships and diamond packages in LKR.", cta: "VIEW PACKAGES →", to: "/freefire" as const },
  { icon: "🤖", title: "Free Fire Info Bot", text: "Look up Free Fire player level, likes, ranks and guild information.", cta: "CHECK PLAYER INFO →", to: "/freefire-info" as const },
  { icon: "🎮", title: "Game Top-ups", text: "Top-ups for supported mobile and online games.", cta: "VIEW TOP-UPS →", to: "/catalog" as const },
  { icon: "🎁", title: "Gift Cards", text: "Digital gift cards and prepaid products.", cta: "VIEW GIFT CARDS →", to: "/catalog" as const },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="hero py-16 md:py-24">
          <div className="wrap relative z-10 grid items-center gap-12 md:grid-cols-[1.1fr_.9fr]">
            <div className="fade-up">
              <span className="eyebrow">✦ Your digital top-up store</span>
              <h1 className="my-6 text-[clamp(48px,7vw,82px)] font-black leading-[.96] tracking-[-0.05em]">
                POWER UP <span className="block text-brand-2">YOUR GAME.</span>
              </h1>
              <p className="max-w-[570px] text-[17px] leading-8 text-on-dark-muted">
                Discover game top-ups and digital gift cards in one place. Check any Free Fire player with our Info Bot,
                choose a package and our team will help you complete it.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/freefire" className="btn btn-primary">Buy Free Fire Diamonds →</Link>
                <Link to="/freefire-info" className="btn btn-light">🤖 FF Info Bot</Link>
              </div>
              <div className="mt-11 flex gap-7">
                {[["Game", "Top-ups"], ["Digital", "Gift Cards"], ["Friendly", "Support"]].map(([b, s]) => (
                  <div key={b}>
                    <b className="block text-lg">{b}</b>
                    <small className="mt-1 block text-xs uppercase tracking-wider text-on-dark-muted">{s}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative grid min-h-[260px] place-items-center md:min-h-[330px]">
              <img src={emblemUrl} alt="NAVIYA TOPUP mascot" className="emblem" />
              <div className="glass absolute left-0 top-6 px-4 py-3 text-xs font-extrabold">
                ⚡ Game top-ups<small className="mt-1 block font-medium text-on-dark-muted">Popular digital products</small>
              </div>
              <div className="glass absolute bottom-6 right-0 px-4 py-3 text-xs font-extrabold">
                🤖 FF Info Bot<small className="mt-1 block font-medium text-on-dark-muted">Check any player UID</small>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="wrap">
            <SectionHead kicker="Shop by category" title="What Are You Looking For?">
              Browse our main product categories, or check a Free Fire player before you top up.
            </SectionHead>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((c) => (
                <Link key={c.title} to={c.to} className="surface surface-hover p-6">
                  <div className="icon-tile mb-4">{c.icon}</div>
                  <h3 className="mb-2 text-lg font-bold">{c.title}</h3>
                  <p className="mb-5 min-h-[58px] text-sm leading-6 text-muted-foreground">{c.text}</p>
                  <span className="text-[13px] font-black text-brand">{c.cta}</span>
                </Link>
              ))}
            </div>
            <div className="banner-strip mt-11 flex flex-col items-start justify-between gap-5 rounded-2xl p-7 md:flex-row md:items-center md:px-8">
              <div>
                <h3 className="mb-1.5 text-xl font-bold">Need help choosing a product?</h3>
                <p className="text-sm text-on-dark-muted">Send us a message and our team will guide you through the order.</p>
              </div>
              <a className="btn btn-light" href={whatsappLink()} target="_blank" rel="noopener">MESSAGE NAVIYA ↗</a>
            </div>
          </div>
        </section>

        <section id="how" className="bg-muted py-16 md:py-20">
          <div className="wrap">
            <SectionHead kicker="Simple ordering" title="How It Works">
              A clear process from choosing a product to receiving your order.
            </SectionHead>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["01", "Choose Your Product", "Browse the catalog and select the game top-up or digital product you need."],
                ["02", "Verify Your Player ID", "Enter your Free Fire UID — we check the player name before you order."],
                ["03", "Confirm & Receive", "Our team confirms availability and payment instructions before fulfilment."],
              ].map(([n, t, p]) => (
                <div key={n} className="surface p-6 shadow-none">
                  <div className="mb-3.5 grid h-8 w-8 place-items-center rounded-lg bg-accent text-xs font-black text-brand">{n}</div>
                  <b className="text-[17px]">{t}</b>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-20">
          <div className="wrap">
            <SectionHead kicker="Why NAVIYA TOPUP" title="A Straightforward Top-up Experience">
              We aim to make digital purchases easy to understand, with clear communication at every step.
            </SectionHead>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["🧾", "Clear Order Details", "We confirm product, player information and total price before proceeding."],
                ["🔐", "Payment Transparency", "Payment methods and confirmation are shared with you before you pay."],
                ["💬", "Direct Support", "Contact our team through WhatsApp if you need help with an order."],
              ].map(([i, t, p]) => (
                <div key={t} className="surface p-6">
                  <div className="icon-tile mb-3">{i}</div>
                  <b className="text-[17px]">{t}</b>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-muted py-16 md:py-20">
          <div className="wrap">
            <div className="contact-strip flex flex-col items-start justify-between gap-5 rounded-[20px] p-7 md:flex-row md:items-center md:px-[6%] md:py-9">
              <div>
                <h2 className="mb-2 text-[26px] font-black">Ready to place an order?</h2>
                <p className="text-sm text-on-dark-muted">Talk to NAVIYA TOPUP on WhatsApp for product availability and assistance.</p>
              </div>
              <a className="btn btn-light" href={whatsappLink()} target="_blank" rel="noopener">WHATSAPP: {WHATSAPP_DISPLAY} ↗</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
