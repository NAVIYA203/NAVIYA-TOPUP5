import type { ReactNode } from "react";

import emblemUrl from "@/assets/naviya-emblem.png";

export function PageHero({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero relative overflow-hidden py-12 md:py-14">
      <img src={emblemUrl} alt="" aria-hidden="true" className="hero-mark" />
      <div className="wrap relative z-10">
        <h1 className="mb-2 text-4xl font-black tracking-tight md:text-[44px]">{title}</h1>
        {children && <p className="max-w-2xl text-base text-on-dark-muted">{children}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto mb-9 max-w-[650px] text-center">
      <span className="kicker">{kicker}</span>
      <h2 className="my-2.5 text-3xl font-black tracking-tight md:text-[34px]">{title}</h2>
      {children && <p className="text-[15px] leading-7 text-muted-foreground">{children}</p>}
    </div>
  );
}
