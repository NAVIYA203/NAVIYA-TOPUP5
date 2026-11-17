import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/SiteHeader";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Setup Required | NAVIYA TOPUP" },
      { name: "description", content: "NAVIYA TOPUP admin panel setup checklist." },
      { property: "og:title", content: "Admin | NAVIYA TOPUP" },
      { property: "og:description", content: "Admin panel setup checklist for NAVIYA TOPUP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen">
      <header className="h-[66px] border-b border-border md:h-[76px]">
        <div className="wrap flex h-full items-center justify-between">
          <Logo />
          <Link to="/" className="btn btn-light">← View website</Link>
        </div>
      </header>
      <PageHero title="Admin Panel — Setup Required">A secure admin area for orders can be added once order storage and login are set up.</PageHero>
      <div className="wrap my-9 max-w-[900px]">
        <div className="surface p-6">
          <div className="notice mb-5">This page is a checklist, not a live admin dashboard.</div>
          <h3 className="mb-2 text-lg font-bold">What the admin panel will include</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
            <li>Secure admin login</li>
            <li>Customer order list and order status management</li>
            <li>Supplier order references and status updates</li>
            <li>Payment verification records and refund handling</li>
            <li>Product catalog and price controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
