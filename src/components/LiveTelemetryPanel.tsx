"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const LATENCY_BARS = [
  { h: 18, peak: false },
  { h: 28, peak: false },
  { h: 42, peak: false },
  { h: 55, peak: false },
  { h: 72, peak: false },
  { h: 88, peak: false },
  { h: 100, peak: true },
  { h: 78, peak: false },
  { h: 64, peak: false },
  { h: 48, peak: false },
  { h: 36, peak: false },
  { h: 26, peak: false },
  { h: 20, peak: false },
] as const;

const TRACE_STEPS = [
  {
    id: "ingress",
    badge: "01 INGRESS",
    badgeTone: "neutral" as const,
    title: "LangChain SDR Agent → Lyzr Gateway Ingress",
    titleShort: "SDR Agent → Gateway Ingress",
    meta: "14ms",
    metaShort: "14ms",
    body: "Input prompt parsed (1,420 tokens), enterprise SAML role verified via Okta IdP.",
    bodyShort: "1,420 tokens parsed · Okta SAML verified.",
    status: null as string | null,
  },
  {
    id: "route",
    badge: "02 ROUTE",
    badgeTone: "active" as const,
    title: "Dynamic LLM Switcher (ShadowLM Router)",
    titleShort: "Dynamic LLM Switcher",
    meta: "92ms · $0.0018 Saved",
    metaShort: "92ms · saved",
    body: null,
    bodyShort: null,
    status: null as string | null,
    models: [
      { label: "GPT-4o (Standby)", short: "GPT-4o · Standby", selected: false },
      { label: "Claude 3.5 Sonnet (Selected: 99.4% Eval)", short: "Claude 3.5 · Selected", selected: true },
      { label: "Llama 3 70B (VPC Fallback)", short: "Llama 3 · Fallback", selected: false },
    ],
  },
  {
    id: "guard",
    badge: "03 GUARD",
    badgeTone: "pass" as const,
    title: "Hallucination & PII Wire Safety Filter",
    titleShort: "Hallucination & PII Filter",
    meta: "PASSED",
    metaShort: "PASS",
    body: "PII Scanned: 0 Leaked (SSN, IBAN masked before LLM egress)",
    bodyShort: "PII scanned · 0 leaked · SSN/IBAN masked.",
    status: "Grounding Confidence: 99.88%",
  },
] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    let done = false;

    const mark = () => {
      if (done) return;
      done = true;
      setInView(true);
    };

    const isVisible = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh * 0.95 && rect.bottom > 0;
    };

    if (isVisible()) {
      mark();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting || isVisible()) mark();
      },
      { threshold: 0.08 },
    );
    io.observe(el);

    const onScroll = () => {
      if (isVisible()) mark();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Fallback for environments where IO/scroll events are unreliable
    const fallback = window.setTimeout(() => {
      if (isVisible()) mark();
    }, 600);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(fallback);
    };
  }, [inView]);

  return { ref, inView };
}

function useCountUp(active: boolean, target: number, durationMs: number, decimals = 0) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active || reduced) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    setValue(0);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, durationMs, reduced]);

  if (decimals > 0) return value.toFixed(decimals);
  return Math.round(value).toString();
}

function badgeClass(tone: "neutral" | "active" | "pass") {
  if (tone === "active") return "telemetry-badge telemetry-badge-active";
  if (tone === "pass") return "telemetry-badge telemetry-badge-pass";
  return "telemetry-badge telemetry-badge-neutral";
}

export default function LiveTelemetryPanel() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const live = inView && !reduced;
  const latency = useCountUp(inView, 142, 1200);
  const efficiency = useCountUp(inView, 94.2, 1400, 1);

  return (
    <div
      className={`telemetry-shell ${inView ? "is-live" : ""} ${reduced ? "is-reduced" : ""}`}
      ref={ref}
    >
      <div className="telemetry-glow" aria-hidden="true" />
      <div className="telemetry-panel">
        <div className="telemetry-scan" aria-hidden="true" />

        <header className="telemetry-chrome">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex gap-1.5 shrink-0" aria-hidden="true">
              <span className="telemetry-traffic bg-[#ff5f57]" />
              <span className="telemetry-traffic bg-[#febc2e]" />
              <span className="telemetry-traffic bg-[#28c840]" />
            </div>
            <div className="min-w-0 text-[12px] font-mono leading-none">
              <span className="text-[#111111] font-medium">lyzr-control-plane</span>
              <span className="text-[#a3a3a3] hidden sm:inline">
                {" "}
                // cluster: us-east-1 // sovereign-vpc-4019
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="telemetry-armed">
              <span className="telemetry-armed-dot" />
              RUNTIME ARMED
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#a3a3a3]">
              <span className="telemetry-sync-dot" />
              Audit Sync: Active
            </span>
          </div>
        </header>

        <div className="telemetry-body">
          <div className="telemetry-trace">
            <div className="telemetry-trace-head flex items-start sm:items-center justify-between gap-2 mb-3 sm:mb-4">
              <div className="min-w-0">
                <p className="text-[12px] sm:text-[12.5px] font-semibold text-[#111111] tracking-tight text-balance leading-snug">
                  <span className="telemetry-title-short">Orchestration Trace</span>
                  <span className="telemetry-title-full">Active Multi-Agent Orchestration Trace</span>
                </p>
                <p className="text-[10.5px] sm:text-[11px] font-mono text-[#a3a3a3] mt-0.5">
                  Live request path · 3 hops resolved
                </p>
              </div>
              <span className="telemetry-trace-id shrink-0">#tr-99824f</span>
            </div>

            <ol className="telemetry-timeline">
              <div className="telemetry-rail" aria-hidden="true">
                <span className="telemetry-rail-fill" />
              </div>

              {TRACE_STEPS.map((step, index) => (
                <li
                  className={`telemetry-step telemetry-step-${index + 1}`}
                  key={step.id}
                  style={{ "--step-i": index } as CSSProperties}
                >
                  <span className={`telemetry-node telemetry-node-${step.badgeTone}`} aria-hidden="true">
                    <span className="telemetry-node-core" />
                  </span>

                  <article className={`telemetry-card telemetry-card-${step.badgeTone}`}>
                    <div className="telemetry-card-head">
                      <div className="telemetry-card-head-main">
                        <span className={badgeClass(step.badgeTone)}>{step.badge}</span>
                        <span
                          className={`telemetry-card-meta ${
                            step.badgeTone === "pass"
                              ? "is-pass"
                              : step.badgeTone === "active"
                                ? "is-active"
                                : ""
                          }`}
                        >
                          <span className="telemetry-meta-full">{step.meta}</span>
                          <span className="telemetry-meta-short">{step.metaShort}</span>
                        </span>
                      </div>
                      <h3 className="telemetry-card-title">
                        <span className="telemetry-title-full">{step.title}</span>
                        <span className="telemetry-title-short">{step.titleShort}</span>
                      </h3>
                    </div>

                    {(() => {
                      const bodyFull = step.body ?? null;
                      const bodyMobile = step.bodyShort ?? step.body ?? null;
                      if (!bodyFull && !bodyMobile && !step.status) return null;
                      return (
                        <div className="telemetry-card-body">
                          {bodyFull || bodyMobile ? (
                            <p className="telemetry-card-copy">
                              {bodyFull ? <span className="telemetry-copy-full">{bodyFull}</span> : null}
                              {bodyMobile ? <span className="telemetry-copy-short">{bodyMobile}</span> : null}
                            </p>
                          ) : null}
                          {step.status ? (
                            <span className="telemetry-card-status">{step.status}</span>
                          ) : null}
                        </div>
                      );
                    })()}

                    {"models" in step && step.models ? (
                      <div className="telemetry-models">
                        {step.models.map((model) => (
                          <span
                            className={
                              model.selected
                                ? "telemetry-model telemetry-model-selected"
                                : "telemetry-model"
                            }
                            key={model.label}
                          >
                            {model.selected ? <span className="telemetry-model-live" /> : null}
                            <span className="telemetry-model-full">{model.label}</span>
                            <span className="telemetry-model-short">{model.short}</span>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                </li>
              ))}
            </ol>
          </div>

          <aside className="telemetry-metrics">
            <div className="telemetry-metric-block">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-[#a3a3a3]">
                  Fleet Latency
                </span>
                <span className="telemetry-chip">p50 live</span>
              </div>

              <div className="flex items-end flex-wrap gap-2.5 mb-4">
                <span className="text-[34px] sm:text-[40px] leading-none font-semibold tracking-tight text-[#111111] tabular-nums">
                  {latency}
                  <span className="text-[15px] font-medium text-[#a3a3a3] ml-0.5">ms</span>
                </span>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#f4f4f4] px-2 py-0.5 text-[11px] font-mono font-semibold text-[#525252]">
                  <svg aria-hidden className="h-3 w-3" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M6 2.5v7M6 2.5 3.5 5M6 2.5 8.5 5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.4"
                    />
                  </svg>
                  18ms vs SLA
                </span>
              </div>

              <div className="telemetry-chart" aria-hidden="true">
                <div className="telemetry-chart-grid">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="telemetry-bars">
                  {LATENCY_BARS.map((bar, i) => (
                    <div
                      className={`telemetry-bar ${bar.peak ? "is-peak" : ""} ${live ? "is-animating" : ""}`}
                      key={i}
                      style={
                        {
                          "--bar-h": `${bar.h}%`,
                          "--bar-delay": `${0.12 + i * 0.04}s`,
                          "--bar-live-delay": `${i * 0.14}s`,
                        } as CSSProperties
                      }
                    >
                      <span className="telemetry-bar-fill" />
                    </div>
                  ))}
                </div>
                <div className="telemetry-chart-labels">
                  <span>40</span>
                  <span>120</span>
                  <span>200</span>
                  <span>ms</span>
                </div>
              </div>
            </div>

            <div className="telemetry-efficiency">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-[#737373]">Token Burn Efficiency</span>
                <span className="text-[18px] font-semibold tabular-nums text-[#111111] tracking-tight">
                  {efficiency}%
                </span>
              </div>
              <div className="telemetry-progress-track">
                <div
                  className={`telemetry-progress ${inView ? "is-filled" : ""}`}
                  style={{ ["--progress" as string]: "94.2%" }}
                >
                  <span className="telemetry-progress-sheen" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#a3a3a3]">
                  12.4M sovereign tokens today
                </span>
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#525252]">
                  Optimal
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
