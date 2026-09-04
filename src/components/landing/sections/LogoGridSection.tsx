'use client';

import { TRUSTED_LOGOS } from "../data";
import { ArrowHint, LogoTile } from "../ui";

function MobileLogoChip({ name, src }: { name: string; src: string }) {
  return (
    <div className="customer-marquee-chip">
      <img
        alt={name}
        className="customer-marquee-logo"
        height={28}
        loading="lazy"
        src={src}
        width={96}
      />
    </div>
  );
}

export function LogoGridSection() {
  const loop = [...TRUSTED_LOGOS, ...TRUSTED_LOGOS];

  return (
    <section className="w-full border-y border-border-crisp bg-surface-canvas py-space-48 md:py-space-64">
      <div className="max-w-container-max mx-auto page-pad">
        <div className="max-w-3xl mb-space-24 md:mb-space-32">
          <h2 className="font-display display-h2 font-semibold text-text-primary max-w-[22ch]">
            Trusted by teams shipping agents in regulated production.
          </h2>
          <p className="text-[15px] md:text-[16px] text-text-secondary mt-space-12 leading-relaxed max-w-2xl">
            Systems integrators, banks, and airlines run production-grade agent fleets on Lyzr every day.
          </p>
          <a className="inline-flex items-center gap-1 text-[14px] font-medium text-text-muted hover:text-text-primary transition-colors mt-space-16" href="#testimonials">
            Read customer stories
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        {/* Mobile: compact marquee + metric strip */}
        <div className="customer-mobile">
          <div aria-hidden className="customer-marquee" role="presentation">
            <div className="customer-marquee-track">
              {loop.map((logo, i) => (
                <MobileLogoChip key={`${logo.name}-${i}`} name={logo.name} src={logo.src} />
              ))}
            </div>
          </div>
          <ul className="sr-only">
            {TRUSTED_LOGOS.map((logo) => (
              <li key={logo.name}>{logo.name}</li>
            ))}
          </ul>

          <a className="customer-mobile-featured" href="#testimonials">
            <div className="customer-mobile-featured-copy">
              <p className="customer-mobile-featured-kicker">Production outcome</p>
              <p className="customer-mobile-featured-metric">
                <span>95%</span>
                <span className="customer-mobile-featured-label">POC-to-production conversion</span>
              </p>
            </div>
            <span aria-hidden className="customer-mobile-featured-arrow">
              <svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.5 9.5 9.5 2.5M9.5 2.5H4.25M9.5 2.5V7.75"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.4"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* Desktop: bento logo grid */}
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
