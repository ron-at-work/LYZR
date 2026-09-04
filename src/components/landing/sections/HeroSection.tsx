'use client';

import type React from "react";
import { HERO_TICKER } from "../data";
import { formatAgentCount } from "../ui";

const HERO_FLOW = [
  { n: "01", label: "Design", tip: "Architect" },
  { n: "02", label: "Build", tip: "Studio" },
  { n: "03", label: "Simulate", tip: "Eval" },
  { n: "04", label: "Deploy", tip: "CI/CD" },
  { n: "05", label: "Govern", tip: "Control Plane" },
] as const;

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
    <section className="hero-product relative w-full border-b border-hero-line" ref={heroRef}>
      <div className="relative z-10 max-w-container-max mx-auto page-pad pb-10 md:pb-14 hero-offset">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="hero-animate-1 flex flex-wrap items-center gap-2.5 mb-5">
              <span className="font-display text-[14px] font-semibold tracking-tight text-ink">
                Lyzr
              </span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-ink/25" />
              <button
                aria-checked={isDev}
                className="hero-audience-toggle"
                onClick={() => setIsDev((v) => !v)}
                role="switch"
                type="button"
              >
                {isDev ? "Developer view" : "Business view"}
              </button>
            </div>

            {isDev ? (
              <>
                <h1 className="hero-animate-1 font-display display-h1 font-semibold text-ink max-w-[15ch] mb-4">
                  Infrastructure for agents in production.
                </h1>
                <p className="hero-animate-2 text-[16px] sm:text-[17px] text-ink-muted max-w-[32rem] leading-snug">
                  Studio, Architect, and a control plane that governs LangChain, Bedrock, Azure, and custom agents in your VPC.
                </p>
              </>
            ) : (
              <>
                <h1 className="hero-animate-1 font-display display-h1 font-semibold text-ink max-w-[14ch] mb-4">
                  Take AI agents to production.
                </h1>
                <p className="hero-animate-2 text-[16px] sm:text-[17px] text-ink-muted max-w-[32rem] leading-snug">
                  Lyzr is the enterprise platform to design, build, simulate, deploy, and govern a secure AI workforce. End to end.
                </p>
              </>
            )}

            <form
              className="hero-animate-2 hero-email-row mt-7 w-full max-w-[28rem]"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "https://www.lyzr.ai/book-demo/";
              }}
            >
              <label className="sr-only" htmlFor="hero-email">
                Work email
              </label>
              <input
                autoComplete="email"
                className="hero-email-input"
                id="hero-email"
                name="email"
                placeholder="What's your work email?"
                required
                type="email"
              />
              <button className="hero-email-submit btn-brand" type="submit">
                Get started
              </button>
            </form>

            <p className="hero-animate-2 mt-4 text-[13px] text-ink-faint tabular-nums">
              <span className="text-ink font-semibold">{formatAgentCount(agentCount)}</span>
              {" "}agents governed on Lyzr
            </p>
          </div>

          <div className="hero-animate-2 lg:col-span-6 w-full">
            <div className="hero-platform-card">
              <div className="hero-platform-top">
                <span className="hero-platform-kicker">What Lyzr is</span>
                <p className="hero-platform-lead font-display">
                  Full-stack agent infrastructure for the enterprise.
                </p>
              </div>

              <div className="hero-platform-products">
                <div>
                  <strong>Agent Studio</strong>
                  <span>Build and orchestrate agents</span>
                </div>
                <div>
                  <strong>Architect</strong>
                  <span>Text to agentic apps</span>
                </div>
                <div>
                  <strong>Control Plane</strong>
                  <span>Govern any framework</span>
                </div>
              </div>

              <div className="hero-platform-flow" aria-label="Agent lifecycle">
                {HERO_FLOW.map((step, i) => (
                  <div className="hero-platform-step" key={step.n}>
                    <span className="hero-platform-n">{step.n}</span>
                    <span className="hero-platform-label">{step.label}</span>
                    <span className="hero-platform-tip">{step.tip}</span>
                    {i < HERO_FLOW.length - 1 ? (
                      <span aria-hidden className="hero-platform-arrow" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-animate-4 relative z-10 border-t border-hero-rule bg-surface-card">
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
