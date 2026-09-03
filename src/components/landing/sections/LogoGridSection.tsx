'use client';

import { TRUSTED_LOGOS } from "../data";
import { ArrowHint, LogoTile } from "../ui";

export function LogoGridSection() {
  return (
    <section className="w-full border-y border-border-crisp bg-surface-canvas py-space-48 md:py-space-64">
      <div className="max-w-container-max mx-auto page-pad">
        <div className="max-w-3xl mb-space-32">
          <h2 className="font-display display-h2 font-medium text-text-primary">
            Governing autonomous agents at the world&apos;s most ambitious{" "}
            <span className="font-semibold">enterprises and financial institutions.</span>
          </h2>
          <p className="text-[15px] md:text-[16px] text-text-secondary mt-space-12 leading-relaxed max-w-2xl">
            From global systems integrators to regulated banks and airlines — production-grade agent fleets run on Lyzr every day.
          </p>
          <a className="inline-flex items-center gap-1 text-[14px] font-medium text-text-muted hover:text-text-primary transition-colors mt-space-16" href="#testimonials">
            Read customer stories
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
        <div className="customer-grid">
          {TRUSTED_LOGOS.map((logo) => (
            <LogoTile
              col={logo.col}
              href={"href" in logo ? logo.href : undefined}
              key={logo.name}
              name={logo.name}
              row={logo.row}
              src={logo.src}
            />
          ))}
          <div className="customer-featured group text-left">
            <div className="relative h-full w-full min-h-[280px] lg:min-h-0">
              <div className="absolute inset-0 bg-brand-ink" />
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-3 px-6 pb-6">
                <p className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                  Production outcome
                </p>
                <p className="text-[44px] md:text-[52px] font-semibold leading-none tracking-tight text-white">
                  95%
                </p>
                <p className="text-[15px] text-white/70">POC-to-production conversion</p>
              </div>
            </div>
            <span aria-hidden>
              <ArrowHint />
            </span>
            <a
              aria-label="Read customer stories"
              className="absolute inset-0 z-30 rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
              href="#testimonials"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
