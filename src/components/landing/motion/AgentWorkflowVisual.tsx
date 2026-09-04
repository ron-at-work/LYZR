'use client';

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    id: "design",
    title: "Design",
    product: "Architect",
    body: "Describe the workflow in plain English. Architect drafts agents, tools, prompts, and a working UI.",
  },
  {
    id: "build",
    title: "Build",
    product: "Agent Studio",
    body: "Configure agents visually or in code. Knowledge, tools, memory, voice, and multi-agent flows on one runtime.",
  },
  {
    id: "simulate",
    title: "Simulate",
    product: "Eval + RAI",
    body: "Thousands of edge cases before a customer sees an answer. Hallucination, PII, and policy checks in the lab.",
  },
  {
    id: "deploy",
    title: "Deploy",
    product: "CI/CD",
    body: "Promote through environments into your VPC. Same discipline as software: version, approve, ship.",
  },
  {
    id: "govern",
    title: "Govern",
    product: "Control Plane",
    body: "Any framework, any cloud, one plane. Identity, traces, cost, and audit trails for every agent run.",
  },
] as const;

type AgentWorkflowVisualProps = {
  variant?: "hero" | "section";
};

export function AgentWorkflowVisual({ variant = "section" }: AgentWorkflowVisualProps) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const step = STEPS[active];
  const isHero = variant === "hero";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      if (paused.current) return;
      setActive((n) => (n + 1) % STEPS.length);
    }, 3200);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`workflow-board${isHero ? " workflow-board--hero" : ""}`}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="workflow-board-rail" role="tablist" aria-label="Agent lifecycle">
        {STEPS.map((item, i) => (
          <button
            aria-selected={i === active}
            className={`workflow-board-step${i === active ? " is-active" : ""}`}
            key={item.id}
            onClick={() => setActive(i)}
            onFocus={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            role="tab"
            type="button"
          >
            <span className="workflow-board-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="workflow-board-label">{item.title}</span>
          </button>
        ))}
      </div>

      <div className="workflow-board-panel" role="tabpanel">
        <div className="workflow-board-meta">
          <span className="workflow-board-product">{step.product}</span>
          <h3 className="workflow-board-title font-display">{step.title}</h3>
          <p className="workflow-board-body">{step.body}</p>
        </div>

        <div aria-hidden className="workflow-board-stage">
          <div className={`workflow-stage-frame workflow-stage-frame--${step.id}`}>
            <div className="workflow-stage-chrome">
              <span />
              <span />
              <span />
              <em>{step.product}</em>
            </div>
            <div className="workflow-stage-body">
              {step.id === "design" ? (
                <>
                  <div className="wf-line wf-line--prompt">Build a claims triage agent for insurance...</div>
                  <div className="wf-cards">
                    <div className="wf-mini">Agent graph</div>
                    <div className="wf-mini">UI scaffold</div>
                    <div className="wf-mini">Tools</div>
                  </div>
                </>
              ) : null}
              {step.id === "build" ? (
                <>
                  <div className="wf-nodes">
                    <span>Retriever</span>
                    <span className="is-volt">Manager</span>
                    <span>Writer</span>
                  </div>
                  <div className="wf-line">Studio · Knowledge · Voice · SuperFlow</div>
                </>
              ) : null}
              {step.id === "simulate" ? (
                <>
                  <div className="wf-bars">
                    <i style={{ width: "92%" }} />
                    <i style={{ width: "78%" }} />
                    <i style={{ width: "96%" }} />
                  </div>
                  <div className="wf-line">10,000 sims · RAI · hallucination gate</div>
                </>
              ) : null}
              {step.id === "deploy" ? (
                <>
                  <div className="wf-pipeline">
                    <span>Dev</span>
                    <span>UAT</span>
                    <span className="is-volt">Prod</span>
                  </div>
                  <div className="wf-line">VPC · BYOK · promotion gates</div>
                </>
              ) : null}
              {step.id === "govern" ? (
                <>
                  <div className="wf-grid-mini">
                    <span>LangChain</span>
                    <span>Bedrock</span>
                    <span>Azure</span>
                    <span className="is-volt">Lyzr</span>
                  </div>
                  <div className="wf-line">One plane · identity · traces · cost</div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
