import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  return (
    <>
      <footer className="site-footer pb-6 pt-12">
        <div className="wrap">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <Logo tone="dark" size="lg" />
              <p className="mt-4 max-w-[300px] text-sm leading-7 text-on-dark-muted">
                Game top-ups and digital products, with friendly customer support.
              </p>
            </div>
            <FootCol title="STORE">
              <Link to="/catalog">Browse products</Link>
              <Link to="/freefire">Free Fire diamonds</Link>
              <Link to="/freefire-info">Free Fire Info Bot</Link>
            </FootCol>
            <FootCol title="INFORMATION">
              <a href="/#how">How it works</a>
              <a href="/#about">About us</a>
              <Link to="/admin">Admin access</Link>
            </FootCol>
            <FootCol title="CONTACT">
              <a href={whatsappLink()} target="_blank" rel="noopener">
                {WHATSAPP_DISPLAY}
              </a>
            </FootCol>
          </div>
          <div className="mt-9 flex flex-col justify-between gap-2 border-t border-on-dark/10 pt-5 text-xs text-on-dark-muted/80 sm:flex-row">
            <span>© 2026 NAVIYA TOPUP. All rights reserved.</span>
            <span>Free Fire player data from Games Kinbo API.</span>
          </div>
        </div>
      </footer>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="btn-whatsapp fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle />
      </a>
    </>
  );
}

function FootCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 text-sm text-on-dark-muted [&_a:hover]:text-on-dark">
      <b className="text-[13px] tracking-wider text-on-dark">{title}</b>
      {children}
    </div>
  );
}
