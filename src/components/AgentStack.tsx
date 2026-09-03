"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import StackVisual from "./StackVisual";

const LAYERS = [
  {
    num: "01" as const,
    short: "Connect",
    name: "Connect anywhere",
    body: "Agents on AWS Bedrock, Azure AI, GCP Vertex, LangChain, CrewAI, AutoGen, or a custom stack plug into one control plane.",
    tags: ["AWS Bedrock", "Azure AI", "LangChain", "On-prem"],
  },
  {
    num: "02" as const,
    short: "Any LLM",
    name: "Run on any LLM",
    body: "Swap models without rewriting agents. Route GPT-4o, Claude, Gemini, Llama, or Mistral from config — no redeploy.",
    tags: ["GPT-4o", "Claude", "Gemini", "Llama"],
  },
  {
    num: "03" as const,
    short: "Simulate",
    name: "Simulate before prod",
    body: "Thousands of synthetic scenarios and adversarial prompts run before live traffic. Reliability is scored before launch.",
    tags: ["Adversarial tests", "Scenario runs", "Reliability score"],
  },
  {
    num: "04" as const,
    short: "Observe",
    name: "Observability",
    body: "Every action, tool call, and token step is traced. Latency and cost show up before users feel them.",
    tags: ["End-to-end traces", "Latency", "Cost per run"],
  },
  {
    num: "05" as const,
    short: "Guard",
    name: "Guard every output",
    body: "Hallucination scoring and PII masking run inline. Block, flag, or reroute untrusted output before it hits the UI.",
    tags: ["Live detection", "PII masking", "Block / flag"],
  },
  {
    num: "06" as const,
    short: "Govern",
    name: "Access & governance",
    body: "RBAC at agent, tool, and data level. SSO with your IdP. Policy is evaluated at runtime, not in a wiki.",
    tags: ["SSO", "RBAC", "Policy"],
  },
  {
    num: "07" as const,
    short: "Audit",
    name: "Audit & compliance",
    body: "Immutable logs on prompts, responses, tool runs, and approvals. Export a package when an auditor asks.",
    tags: ["SOC 2", "HIPAA", "GDPR"],
  },
] as const;

const AUTO_MS = 5200;
const RESUME_MS = 9000;

export default function AgentStack() {
  const [open, setOpen] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(false);

  const active = LAYERS[open];

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.28),
      { threshold: [0.28, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const clearResume = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  const holdPause = useCallback(() => {
    clearResume();
    setPaused(true);
  }, [clearResume]);

  const softResume = useCallback(
    (delay = 1200) => {
      clearResume();
      resumeTimer.current = setTimeout(() => setPaused(false), delay);
    },
    [clearResume],
  );

  const selectLayer = useCallback(
    (index: number) => {
      setOpen(index);
      setProgressKey((k) => k + 1);
      holdPause();
      softResume(RESUME_MS);
    },
    [holdPause, softResume],
  );

  const canAutoplay = !paused && inView && !reducedMotion.current;

  useEffect(() => {
    if (!canAutoplay) return;
    const id = setInterval(() => {
      setOpen((i) => (i + 1) % LAYERS.length);
      setProgressKey((k) => k + 1);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [canAutoplay, open]);

  useEffect(() => () => clearResume(), [clearResume]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        selectLayer((open + 1) % LAYERS.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        selectLayer((open - 1 + LAYERS.length) % LAYERS.length);
      }
    },
    [open, selectLayer],
  );

  return (
    <section className="w-full bg-hero-canvas section-y" id="architecture">
      <div className="mx-auto max-w-container-max page-pad">
        <div className="stack-header">
          <div className="stack-header-copy">
            <span className="stack-eyebrow">Agent production stack</span>
            <h2 className="display-h2 font-medium text-ink">
              Seven layers between a prototype and{" "}
              <em className="font-editorial-italic pb-1 text-[1.08em] leading-[1.12] text-primary">
                production.
              </em>
            </h2>
            <p className="mt-4 max-w-[42ch] text-[16px] leading-relaxed text-ink-muted">
              The same control plane from connect to compliance.
            </p>
          </div>
          <div aria-hidden className="stack-header-meta">
            <span className="stack-header-count">
              <strong>{active.num}</strong>
              <span>/ {String(LAYERS.length).padStart(2, "0")}</span>
            </span>
            <span className="stack-header-active">{active.short}</span>
          </div>
        </div>

        <div
          className="stack-shell"
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) softResume();
          }}
          onFocusCapture={holdPause}
          onKeyDown={onKeyDown}
          onMouseEnter={holdPause}
          onMouseLeave={() => softResume()}
          ref={stageRef}
        >
          <div
            aria-label="Agent production layers"
            className="stack-nav"
            role="tablist"
          >
            <div aria-hidden className="stack-nav-rail" />
            {LAYERS.map((layer, i) => {
              const isActive = open === i;
              const isPast = i < open;
              return (
                <button
                  aria-controls="stack-panel"
                  aria-selected={isActive}
                  className={`stack-nav-item${isActive ? " is-active" : ""}${isPast ? " is-past" : ""}`}
                  id={`stack-tab-${layer.num}`}
                  key={layer.num}
                  onClick={() => selectLayer(i)}
                  role="tab"
                  type="button"
                >
                  <span className="stack-nav-marker">
                    <span className="stack-nav-dot" />
                    {isActive && canAutoplay ? (
                      <span
                        aria-hidden
                        className="stack-nav-ring"
                        key={progressKey}
                        style={{ animationDuration: `${AUTO_MS}ms` }}
                      />
                    ) : null}
                  </span>
                  <span className="stack-nav-copy">
                    <span className="stack-nav-top">
                      <span className="stack-nav-index">{layer.num}</span>
                      <span className="stack-nav-short">{layer.short}</span>
                    </span>
                    <span className="stack-nav-hint">{layer.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            aria-labelledby={`stack-tab-${active.num}`}
            className="stack-panel"
            id="stack-panel"
            key={active.num}
            role="tabpanel"
          >
            <div className="stack-panel-copy">
              <div className="stack-panel-kicker-row">
                <span className="stack-panel-kicker">Layer {active.num}</span>
                <span className="stack-panel-step">
                  {open + 1} of {LAYERS.length}
                </span>
              </div>
              <h3 className="stack-panel-title">{active.name}</h3>
              <p className="stack-panel-body">{active.body}</p>
              <div className="stack-panel-tags">
                {active.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="stack-panel-controls">
                <button
                  aria-label="Previous layer"
                  className="stack-panel-ctrl"
                  onClick={() => selectLayer((open - 1 + LAYERS.length) % LAYERS.length)}
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label="Next layer"
                  className="stack-panel-ctrl"
                  onClick={() => selectLayer((open + 1) % LAYERS.length)}
                  type="button"
                >
                  →
                </button>
              </div>
            </div>
            <div aria-hidden className="stack-panel-art">
              <StackVisual id={active.num} />
            </div>
            {canAutoplay ? (
              <span
                aria-hidden
                className="stack-panel-progress"
                key={progressKey}
                style={{ animationDuration: `${AUTO_MS}ms` }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
