'use client';

import type React from "react";
import { HERO_TICKER } from "../data";
import { formatAgentCount } from "../ui";

export type HeroSectionProps = {
  heroRef: React.RefObject<HTMLElement | null>;
  isDev: boolean;
  setIsDev: React.Dispatch<React.SetStateAction<boolean>>;
  agentCount: number;
};

export function HeroSection({
  heroRef,
  isDev,
  setIsDev,
  agentCount,
}: HeroSectionProps) {
  return (
    <section className="hero-atmosphere relative w-full border-b border-hero-line" ref={heroRef}>
      <div aria-hidden className="hero-atmosphere-glow pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-cursor-spot pointer-events-none absolute inset-0" />
      <div className="relative z-10 max-w-container-max mx-auto page-pad pb-5 md:pb-6 flex flex-col items-start text-left hero-offset">
        <button
          aria-checked={isDev}
          className="hero-animate-1 mb-4 sm:mb-5 inline-flex items-center gap-3"
          onClick={() => setIsDev((v) => !v)}
          role="switch"
          type="button"
        >
          <span className={`dev-switch${isDev ? " is-on" : ""}`} aria-hidden>
            <span className="dev-switch-thumb" />
          </span>
          <span className="text-[14px] font-medium tracking-tight text-ink-soft">I&apos;m a Developer</span>
        </button>
        {isDev ? (
          <>
            <p className="hero-animate-1 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.08em] text-primary mb-2">
              Agent infrastructure
            </p>
            <h1 className="hero-animate-1 font-display display-h1 font-semibold text-ink max-w-[18ch] mb-4 pb-0.5">
              The full stack for{" "}
              <em className="font-editorial-italic text-[1.05em] leading-[1.1] text-ink">agent productionization.</em>
            </h1>
            <p className="hero-animate-2 text-[15px] sm:text-[16px] md:text-[18px] text-ink-muted max-w-[34rem] leading-relaxed">
              The control plane your enterprise AI operation has been missing. Agents on AWS, Azure, LangChain, or anywhere else, governed from one plane.
            </p>
          </>
        ) : (
          <>
            <p className="hero-animate-1 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
              Agents in production on Lyzr:{" "}
              <span className="tabular-nums text-ink font-semibold">{formatAgentCount(agentCount)}</span>
            </p>
            <h1 className="hero-animate-1 font-display display-h1 font-semibold text-ink mb-4">
              <span className="block lg:whitespace-nowrap">Take your AI agents</span>
              <span className="block lg:whitespace-nowrap">to production, faster.</span>
            </h1>
            <p className="hero-animate-2 text-[15px] sm:text-[16px] md:text-[18px] text-ink-muted max-w-[34rem] leading-relaxed">
              Build, govern, and run agents on AWS, Azure, LangChain, or anywhere from one control plane.
            </p>
          </>
        )}

        <div className="hero-animate-2 mt-6 hero-actions">
          <a
            className="inline-flex items-center justify-center h-11 px-5 rounded-full btn-brand text-[13.5px] font-semibold tracking-tight shadow-sm active:scale-[0.98] transition-all"
            href="#get-started"
          >
            Get started
          </a>
          <a
            className="hero-cta-secondary inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full text-[13.5px] font-semibold tracking-tight text-ink"
            href="https://www.lyzr.ai/book-demo/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Book a demo
            <svg aria-hidden className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 12 12">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
            </svg>
          </a>
        </div>

        <div className="hero-animate-2 mt-5 flex flex-col gap-3">
          <ul className="hero-proof flex flex-wrap items-center gap-x-0 gap-y-1.5 list-none p-0 m-0">
            {["SOC 2 Type II", "VPC-native", "BYOK encryption", "8-week SLA"].map((item, i) => (
              <li className="hero-proof-item flex items-center text-[12px] text-ink-soft" key={item}>
                {i > 0 ? <span aria-hidden className="hero-proof-dot" /> : null}
                <span className="inline-flex items-center gap-1.5">
                  <svg aria-hidden className="h-3 w-3 text-primary shrink-0" fill="none" viewBox="0 0 12 12">
                    <path d="M2.5 6.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                  </svg>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-2">
            {["AWS", "Azure", "GCP", "LangChain", "CrewAI"].map((stack) => (
              <span className="hero-stack-chip" key={stack}>
                {stack}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-animate-3 relative z-10 w-full max-w-[1100px] mx-auto page-pad mt-2 md:mt-3 pb-0">
        <div className="relative w-full overflow-hidden rounded-t-xl border border-b-0 border-hero-frame bg-ink shadow-video aspect-[16/9]">
          <video
            autoPlay
            className="absolute inset-0 h-full w-full object-cover object-top"
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="https://www.lyzr.ai/wp-content/uploads/2026/05/One-Studio.-Infinite-Possibilities.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-hero-canvas/40 via-transparent to-black/20" />

          <div className="pointer-events-none absolute top-3.5 left-3.5 sm:top-5 sm:left-5">
            <span className="hero-live-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
              <span aria-hidden className="hero-live-dot" />
              Studio live
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-5 sm:left-5 sm:right-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {["Design", "Deploy", "Govern", "Observe"].map((stage) => (
                <span className="hero-stage-chip" key={stage}>
                  {stage}
                </span>
              ))}
            </div>
            <span className="hero-stage-meta hidden sm:inline-flex text-[11px] font-medium uppercase tracking-[0.1em] text-white/70">
              Agent Lifecycle
            </span>
          </div>
        </div>
      </div>

      <div className="hero-animate-4 relative z-10 border-t border-hero-rule bg-surface-card/70 backdrop-blur-sm">
        <div className="overflow-hidden py-3.5">
          <div className="hero-ticker-track flex w-max gap-10 px-6">
            {[...HERO_TICKER, ...HERO_TICKER].map((item, i) => (
              <div className="flex items-center gap-2.5 shrink-0" key={`${item.label}-${i}`}>
                <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-faint whitespace-nowrap">
                  {item.label}
                </span>
                <span className="text-[12px] font-semibold tabular-nums text-ink whitespace-nowrap">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
