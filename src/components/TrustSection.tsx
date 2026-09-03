"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./trust-sec.css";

const STAGE_CARDS = [
  {
    name: "Google I/O 2025",
    title: "Named an Agent2Agent Launch Partner",
    src: "/trust/google-io-2025.webp",
    alt: "Lyzr featured at Google I/O 2025 as an Agent2Agent (A2A) launch partner",
  },
  {
    name: "AWS Summit NYC",
    title: "Building Live at AWS Summit",
    src: "/trust/aws-summit-nyc.webp",
    alt: "Lyzr at the AWS Summit showcasing low-code AI agents",
  },
  {
    name: "IBM Think 2025",
    title: "Added to watsonx Orchestrate Catalog",
    src: "/trust/ibm-think-2025.webp",
    alt: "Lyzr announced as an integration in IBM watsonx Orchestrate Agent Catalog",
    objectPosition: "25% center",
  },
] as const;

const PRESS_CARDS = [
  { className: "pc-cb", logo: "/trust/logo-cbinsights.png", alt: "CB Insights", caption: "Top 100 AI Startup" },
  { className: "pc-tc", logo: "/trust/logo-techcrunch.png", alt: "TechCrunch", stat: { num: "$100M", cap: "Fundraise" } },
  { className: "pc-bb", logo: "/trust/logo-bloomberg.png", alt: "Bloomberg", stat: { num: "$500M", cap: "Valuation" } },
  { className: "pc-yh", logo: "/trust/logo-yahoo.png", alt: "Yahoo Finance", caption: "Investor Market Coverage" },
  { className: "pc-gartner", logo: "/trust/logo-gartner.png", alt: "Gartner", caption: "Tech Innovator in Agentic AI" },
  { className: "pc-ever", logo: "/trust/logo-everest.png", alt: "Everest Group", caption: "AI Agent Platform for HR & BFSI" },
  { className: "pc-idc", logo: "/trust/logo-idc.png", alt: "IDC", caption: "Top AI Agent Orchestration Platform" },
  { className: "pc-g2", logo: "/trust/logo-g2.png", alt: "G2", caption: "Top AI Agent Builder Software" },
  { className: "pc-aws", logo: "/trust/logo-aws.png", alt: "AWS", caption: "Gen AI Innovator 2025" },
  { className: "pc-inc", logo: "/trust/logo-inc.png", alt: "Inc.", caption: "Raised With No Roadshow" },
] as const;

const TRUST_BADGES = [
  { label: "GDPR Compliant", src: "/trust/badge-gdpr.svg" },
  { label: "SOC 2 Type II", src: "/trust/badge-soc2.svg" },
  { label: "ISO 27001 Certified", src: "/trust/badge-iso27001.svg" },
  { label: "HIPAA Compliant", src: "/trust/badge-hipaa.svg" },
  { label: "CCPA", src: "/trust/badge-ccpa.svg" },
] as const;

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export default function TrustSection() {
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeLb = useCallback(() => setLbIndex(null), []);
  const step = useCallback((dir: number) => {
    setLbIndex((cur) => {
      if (cur === null) return cur;
      return (cur + dir + STAGE_CARDS.length) % STAGE_CARDS.length;
    });
  }, []);

  useEffect(() => {
    if (lbIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lbIndex, closeLb, step]);

  const active = lbIndex !== null ? STAGE_CARDS[lbIndex] : null;

  const lightbox =
    mounted && active
      ? createPortal(
          <div className="trust-sec-root">
            <div
              className="pf-lb open"
              role="dialog"
              aria-modal="true"
              aria-label={`${active.name} — ${active.title}`}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest(".pf-lb-img, .pf-lb-cap, .pf-lb-nav, .pf-lb-close")) {
                  closeLb();
                }
              }}
            >
              <button className="pf-lb-close" type="button" aria-label="Close" onClick={closeLb}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
              <button className="pf-lb-nav pf-lb-prev" type="button" aria-label="Previous" onClick={() => step(-1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>
              <button className="pf-lb-nav pf-lb-next" type="button" aria-label="Next" onClick={() => step(1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
              <div className="pf-lb-inner">
                <img className="pf-lb-img" src={active.src} alt={`${active.name} — ${active.title}`} />
                <div className="pf-lb-cap">
                  <span className="pf-lb-name">{active.name}</span>
                  <span className="pf-lb-title">{active.title}</span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="trust-sec-root">
      <section className="trust-sec" aria-label="Trust, press, and compliance">
        <div className="trust-inner">
          <div className="press-featured">
            <span className="press-featured-label">Featured On Stage</span>
            <div className="pf-grid">
              {STAGE_CARDS.map((card, i) => (
                <div
                  key={card.name}
                  className="pf-card"
                  role="button"
                  tabIndex={0}
                  aria-label={`View full image — ${card.name}`}
                  onClick={() => setLbIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLbIndex(i);
                    }
                  }}
                >
                  <div className="pf-imgwrap">
                    <img
                      decoding="async"
                      src={card.src}
                      className="pf-img-default"
                      alt={card.alt}
                      width={900}
                      height={600}
                      loading="lazy"
                      style={"objectPosition" in card ? { objectPosition: card.objectPosition } : undefined}
                    />
                  </div>
                  <button
                    className="pf-zoom"
                    type="button"
                    aria-label="View full image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLbIndex(i);
                    }}
                  >
                    <ZoomIcon />
                  </button>
                  <div className="pf-body">
                    <span className="pf-name">{card.name}</span>
                    <p className="pf-highlight">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="press-embed">
            <span className="press-embed-label">Recognized By</span>
            <div className="press-grid">
              {PRESS_CARDS.map((card) => (
                <div key={card.className} className={`press-card ${card.className}`}>
                  <div className="press-logo">
                    <img decoding="async" src={card.logo} alt={card.alt} width={160} height={40} loading="lazy" />
                  </div>
                  {"stat" in card && card.stat ? (
                    <div className="press-stat">
                      <span className="press-stat-num">{card.stat.num}</span>
                      <span className="press-stat-cap">{card.stat.cap}</span>
                    </div>
                  ) : (
                    <p className="press-caption">{"caption" in card ? card.caption : null}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="trust-divider" />

          <div className="trust-head">
            <span className="agents-eyebrow">Security &amp; Compliance</span>
          </div>

          <div className="trust-icons">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="trust-icon-item">
                <div className="trust-icon-wrap" aria-label={badge.label}>
                  <img className="trust-badge-svg" src={badge.src} alt="" width={48} height={48} loading="lazy" />
                </div>
                <span className="trust-icon-label">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {lightbox}
    </div>
  );
}
