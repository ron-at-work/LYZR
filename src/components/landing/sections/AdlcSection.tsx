'use client';

import { useState } from "react";
import { ADLC_STAGES, type AdlcStageId } from "../data";

export function AdlcSection() {
  const [activeAdlc, setActiveAdlc] = useState<AdlcStageId>("design");

  return (
    <section className="w-full bg-brand-ink border-y border-border-crisp section-y">
      <div className="max-w-container-max mx-auto page-pad">
        <div className="max-w-3xl mb-space-48">
          <h2 className="font-display display-h2 font-semibold text-text-primary">
            Design to production in one lifecycle.
          </h2>
          <p className="text-[16px] text-text-secondary mt-space-12 leading-relaxed">
            From blueprint to sovereign deployment and runtime governance. The full agent development lifecycle on one platform.
          </p>
        </div>
        <div className="adlc-bento mb-space-32">
          {ADLC_STAGES.map((stage) => {
            const isActive = activeAdlc === stage.id;
            return (
              <button
                aria-pressed={isActive}
                className={`adlc-card adlc-card--${stage.id}${isActive ? " is-active" : ""}`}
                key={stage.id}
                onClick={() => setActiveAdlc(stage.id)}
                onFocus={() => setActiveAdlc(stage.id)}
                type="button"
              >
                <div className="adlc-card-beam" aria-hidden="true" />
                <div className="adlc-card-inner bg-surface-card">
                  <div>
                    <div className="flex justify-between items-center mb-space-16">
                      <span className="adlc-card-stage text-[12px] font-mono font-bold text-primary">{stage.title}</span>
                      <span className="adlc-card-icon material-symbols-outlined text-text-muted text-[20px]" aria-hidden="true">
                        {stage.icon}
                      </span>
                    </div>
                    <h3 className="text-[20px] md:text-[22px] font-semibold text-text-primary mb-2 tracking-[-0.02em] text-left">{stage.title}</h3>
                    <p className="text-[13.5px] text-text-secondary leading-relaxed mb-space-16 max-w-prose text-left">
                      {stage.description}
                    </p>
                  </div>
                  <div className="adlc-card-features pt-space-12 border-t border-border-subtle space-y-1.5 text-[12px] font-mono text-text-muted text-left">
                    {stage.features.map((feature) => (
                      <div className="adlc-card-feature" key={feature}>
                        <span className="adlc-card-feature-dot" aria-hidden="true" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {/* Framework Agnostic Ticker */}
        <div className="adlc-frameworks w-full flex items-center justify-between flex-wrap gap-space-12 py-space-12 px-space-16 bg-surface-card border border-border-crisp rounded-xl text-[12px] font-mono">
          <span className="font-medium text-text-primary">Framework Agnostic:</span>
          <span className="text-text-secondary">LangChain</span>
          <span className="text-text-faint" aria-hidden="true">•</span>
          <span className="text-text-secondary">CrewAI</span>
          <span className="text-text-faint" aria-hidden="true">•</span>
          <span className="text-text-secondary">AutoGen</span>
          <span className="text-text-faint" aria-hidden="true">•</span>
          <span className="text-text-secondary">LlamaIndex</span>
          <span className="text-text-faint" aria-hidden="true">•</span>
          <span className="text-text-secondary">Custom Stacks</span>
          <span className="text-text-faint" aria-hidden="true">•</span>
          <span className="text-text-secondary">Any LLM Provider</span>
          <span className="text-text-faint" aria-hidden="true">•</span>
          <span className="text-text-secondary">Any Cloud VPC</span>
        </div>
      </div>
    </section>
  );
}
