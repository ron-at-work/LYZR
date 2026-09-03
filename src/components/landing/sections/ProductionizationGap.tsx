'use client';

import { useEffect, useRef, useState } from "react";
import { NAV_EXT, PROD_GAP_HARD } from "../data";

export function ProductionizationGap() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathSvgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.28 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!drawn) return;
    const svg = pathSvgRef.current;
    if (!svg) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setTimeout(() => {
      svg.querySelectorAll("animateMotion").forEach((node) => {
        const anim = node as SVGAnimateMotionElement;
        try {
          anim.beginElement();
        } catch {
          /* ignore */
        }
      });
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [drawn]);

  return (
    <section
      className={`prod-gap w-full border-y border-white/10${drawn ? " is-drawn" : ""}`}
      id="productionization"
      ref={sectionRef}
    >
      <div aria-hidden className="prod-gap-sky" />
      <div aria-hidden className="prod-gap-terrain">
        <svg className="prod-gap-terrain-svg" preserveAspectRatio="xMidYMax slice" viewBox="0 0 1600 900">
          <defs>
            <linearGradient id="pg-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-ink-end)" />
              <stop offset="42%" stopColor="var(--brand-ink-mid)" />
              <stop offset="100%" stopColor="var(--brand-ink-end)" />
            </linearGradient>
            <linearGradient id="pg-far" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--ink-elevated)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--brand-ink-mid)" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="pg-mid" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-ink-start)" />
              <stop offset="100%" stopColor="var(--brand-ink-end)" />
            </linearGradient>
            <linearGradient id="pg-near" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--prod-gap-near-start)" />
              <stop offset="100%" stopColor="var(--prod-gap-near-end)" />
            </linearGradient>
            <radialGradient cx="50%" cy="62%" id="pg-mist" r="58%">
              <stop offset="0%" stopColor="var(--prod-gap-mist-0)" />
              <stop offset="55%" stopColor="var(--prod-gap-mist-1)" />
              <stop offset="100%" stopColor="var(--prod-gap-mist-2)" />
            </radialGradient>
          </defs>
          <rect fill="url(#pg-sky)" height="900" width="1600" />
          <path d="M0 430 C120 390 210 410 300 360 C420 290 510 330 620 280 C760 210 880 270 980 240 C1120 200 1240 250 1360 220 C1460 195 1540 230 1600 210 L1600 900 L0 900 Z" fill="url(#pg-far)" />
          <path d="M0 560 C140 500 250 540 360 470 C500 380 620 450 760 400 C900 350 1020 430 1160 390 C1300 350 1440 420 1600 380 L1600 900 L0 900 Z" fill="url(#pg-mid)" />
          <path d="M0 690 C180 640 320 700 480 650 C680 580 820 680 1000 640 C1180 600 1360 690 1600 650 L1600 900 L0 900 Z" fill="url(#pg-near)" />
          <ellipse cx="800" cy="620" fill="url(#pg-mist)" rx="720" ry="220" />
        </svg>
      </div>

      <div className="prod-gap-inner max-w-container-max mx-auto page-pad">
        <header className="prod-gap-header">
          <span className="prod-gap-kicker">— The Productionization Gap —</span>
          <h2 className="prod-gap-title">
            Your agent is built.{" "}
            <em className="font-editorial-italic">Now comes the hard part.</em>
          </h2>
          <p className="prod-gap-lede">
            Between a working prototype and a production agent lies a valley of death. Most projects never cross it. Lyzr builds the bridge.
          </p>
          <div className="prod-gap-stat" role="group" aria-label="Industry reality">
            <span className="prod-gap-stat-value">~70%</span>
            <span className="prod-gap-stat-copy">
              of enterprise AI pilots stall before production — not for model quality, but for everything around the model.
            </span>
          </div>
        </header>

        <div className="prod-gap-diagram" aria-label="Prototype to production journey">
          <svg
            aria-hidden
            className="prod-gap-path"
            fill="none"
            ref={pathSvgRef}
            viewBox="0 0 1200 360"
          >
            <defs>
              <linearGradient id="pg-bridge-glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--prod-gap-mist-2)" />
                <stop offset="40%" stopColor="var(--prod-gap-glow)" />
                <stop offset="100%" stopColor="var(--prod-gap-mist-2)" />
              </linearGradient>
              <filter id="pg-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              className="prod-gap-valley-fill"
              d="M470 250 L492 272 L512 244 L534 286 L556 248 L578 298 L600 254 L622 304 L644 260 L666 288 L690 250 L690 340 L470 340 Z"
              fill="url(#pg-bridge-glow)"
            />

            <path
              className="prod-gap-path-safe prod-gap-draw prod-gap-draw--1"
              d="M80 72 C200 72, 260 72, 320 110 C390 156, 430 210, 470 250"
              pathLength={1}
              strokeLinecap="round"
              strokeWidth="3.25"
            />
            <path
              className="prod-gap-path-danger prod-gap-draw prod-gap-draw--2"
              d="M470 250 L492 272 L512 244 L534 286 L556 248 L578 298 L600 254 L622 304 L644 260 L666 288 L690 250"
              pathLength={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.25"
            />
            <path
              className="prod-gap-path-safe prod-gap-draw prod-gap-draw--3"
              d="M690 250 C730 210, 770 156, 840 110 C900 72, 960 72, 1120 72"
              pathLength={1}
              strokeLinecap="round"
              strokeWidth="3.25"
            />

            <path
              className="prod-gap-bridge prod-gap-draw prod-gap-draw--bridge"
              d="M470 250 C520 168, 640 168, 690 250"
              pathLength={1}
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              className="prod-gap-bridge-dash"
              d="M470 250 C520 168, 640 168, 690 250"
              pathLength={1}
              strokeDasharray="4 7"
              strokeLinecap="round"
              strokeWidth="1.25"
            />

            <path
              id="pg-traveler-path"
              d="M80 72 C200 72, 260 72, 320 110 C390 156, 430 210, 470 250 L492 272 L512 244 L534 286 L556 248 L578 298 L600 254 L622 304 L644 260 L666 288 L690 250 C730 210, 770 156, 840 110 C900 72, 960 72, 1120 72"
              fill="none"
              stroke="none"
            />

            <circle className="prod-gap-node prod-gap-node--start" cx="80" cy="72" r="7" />
            <circle className="prod-gap-node prod-gap-node--end" cx="1120" cy="72" r="7" />

            <g className="prod-gap-traveler">
              <circle fill="var(--on-brand-ink)" r="5.5">
                <animateMotion calcMode="linear" dur="5.5s" fill="freeze" begin="indefinite">
                  <mpath href="#pg-traveler-path" />
                </animateMotion>
              </circle>
              <circle fill="var(--prod-gap-traveler-halo)" r="11">
                <animateMotion calcMode="linear" dur="5.5s" fill="freeze" begin="indefinite">
                  <mpath href="#pg-traveler-path" />
                </animateMotion>
              </circle>
            </g>
          </svg>

          <div className="prod-gap-bridge-badge" aria-hidden>
            <span className="prod-gap-bridge-badge-label">Lyzr bridge</span>
          </div>

          <div className="prod-gap-death-callout">
            <span className="prod-gap-death-arrow" aria-hidden>
              ↓
            </span>
            <span className="prod-gap-death-label">Where most enterprise projects die</span>
          </div>

          <div className="prod-gap-tops">
            <div className="prod-gap-top prod-gap-top--start">
              <span className="prod-gap-col-eyebrow">Where you start</span>
              <h3 className="prod-gap-col-title">Prototype Ready</h3>
              <p className="prod-gap-col-meta">Agent built · LLM calls responding · Demo shipped</p>
            </div>
            <div className="prod-gap-top prod-gap-top--end">
              <span className="prod-gap-col-eyebrow">Where you need to be</span>
              <h3 className="prod-gap-col-title">Agent in Production</h3>
              <p className="prod-gap-col-meta">Monitored · Governed · Generating real ROI</p>
            </div>
          </div>

          <div className="prod-gap-bottoms">
            <div className="prod-gap-bottom prod-gap-bottom--easy">
              <span className="prod-gap-col-block-title">The Easy Part</span>
              <ul className="prod-gap-list">
                <li>Demo works in testing</li>
                <li>Stakeholders impressed</li>
                <li>Budget approved</li>
                <li>POC shipped quickly</li>
              </ul>
            </div>
            <div className="prod-gap-bottom prod-gap-bottom--hard">
              <div className="prod-gap-hard-head">
                <span className="prod-gap-col-block-title prod-gap-col-block-title--hard">The Hard Part</span>
                <span className="prod-gap-hard-hint">Hover to see how Lyzr closes each gap</span>
              </div>
              <ul className="prod-gap-reveals">
                {PROD_GAP_HARD.map((item) => (
                  <li className="prod-gap-reveal" key={item.problem} tabIndex={0}>
                    <span className="prod-gap-reveal-problem">{item.problem}</span>
                    <span className="prod-gap-reveal-fix">
                      <span className="prod-gap-reveal-fix-kicker">Lyzr closes it</span>
                      {item.fix}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="prod-gap-bottom prod-gap-bottom--ready">
              <span className="prod-gap-col-block-title">Production-Ready</span>
              <ul className="prod-gap-list">
                <li>Monitored &amp; observable 24/7</li>
                <li>Governed with full audit trail</li>
                <li>Simulation-tested at scale</li>
                <li>Model-agnostic &amp; resilient</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="prod-gap-bridge-cta">
          <p className="prod-gap-bridge-cta-copy">
            Most platforms stop at the demo.{" "}
            <em className="font-editorial-italic">Lyzr ships you across the valley.</em>
          </p>
          <a className="prod-gap-bridge-cta-btn" href="https://www.lyzr.ai/book-demo/" {...NAV_EXT}>
            Cross the gap with Lyzr
            <span className="material-symbols-outlined text-[16px]" aria-hidden>
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
