'use client';

import { useState } from "react";
import { OPERATING_MODELS, type OperatingModelId } from "../data";

export function OperatingModelsSection() {
  const [activeModel, setActiveModel] = useState<OperatingModelId>("foundation");

  return (
    <section className="w-full max-w-container-max mx-auto page-pad section-y" id="operating-models">
      <div className="max-w-3xl mb-space-48">
        <h2 className="font-display display-h2 font-semibold text-text-primary">
          Three ways enterprises use the platform.
        </h2>
        <p className="text-[16px] text-text-secondary mt-space-12">
          The control plane is the foundation. From there, pick the footprint that matches your cloud boundary and team.
        </p>
      </div>
      <div className="om-tabs" role="tablist" aria-label="Operating models">
        {OPERATING_MODELS.map((model) => {
          const isActive = activeModel === model.id;
          return (
            <button
              aria-controls={`om-panel-${model.id}`}
              aria-selected={isActive}
              className={`om-tab${isActive ? " is-active" : ""}`}
              id={`om-tab-${model.id}`}
              key={model.id}
              onClick={() => setActiveModel(model.id)}
              role="tab"
              type="button"
            >
              <span className="om-tab-num">{model.num}</span>
              <span className="om-tab-label">{model.label}</span>
            </button>
          );
        })}
      </div>
      <div className="om-grid">
        {OPERATING_MODELS.map((model) => {
          const isActive = activeModel === model.id;
          return (
            <button
              aria-pressed={isActive}
              className={`om-card${isActive ? " is-active" : ""}`}
              key={model.id}
              onClick={() => setActiveModel(model.id)}
              onFocus={() => setActiveModel(model.id)}
              onMouseEnter={() => setActiveModel(model.id)}
              type="button"
            >
              <div className="om-card-glow" aria-hidden="true" />
              <div className="om-card-body">
                <div>
                  <div className="flex justify-between items-center mb-space-24">
                    <span
                      className={
                        model.badge === "warm"
                          ? "text-[11px] font-mono px-2 py-1 rounded bg-badge-warm-bg border border-badge-warm-border text-badge-warm-text font-medium"
                          : "text-[11px] font-mono px-2 py-1 rounded bg-surface-subtle border border-border-crisp text-text-secondary font-medium"
                      }
                    >
                      {model.num} {model.label}
                    </span>
                    <span className="om-card-icon material-symbols-outlined text-primary text-[24px]" aria-hidden="true">
                      {model.icon}
                    </span>
                  </div>
                  <h3 className="text-[22px] font-semibold text-text-primary mb-3 leading-snug text-left">
                    {model.title} {model.titleEm}
                  </h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed mb-space-24 text-left">
                    {model.description}
                  </p>
                </div>
                <div className="om-card-features space-y-2 pt-space-16 border-t border-border-subtle text-[13px] text-text-primary text-left">
                  {model.features.map((feature) => (
                    <div className="om-card-feature flex items-center gap-2" key={feature}>
                      <span className="material-symbols-outlined text-primary text-[18px]" aria-hidden="true">
                        check_circle
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {(() => {
        const selected = OPERATING_MODELS.find((m) => m.id === activeModel) ?? OPERATING_MODELS[0];
        return (
          <div
            aria-labelledby={`om-tab-${selected.id}`}
            className="om-detail"
            id={`om-panel-${selected.id}`}
            key={selected.id}
            role="tabpanel"
          >
            <div className="om-detail-meta">
              <span className="om-detail-kicker">Selected model</span>
              <span className="om-detail-title">
                {selected.num} · {selected.label}
              </span>
              <p className="om-detail-best">{selected.bestFor}</p>
              <p className="om-detail-footprint">{selected.footprint}</p>
            </div>
            <a className="om-detail-cta" href="#demo">
              {selected.cta}
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                arrow_forward
              </span>
            </a>
          </div>
        );
      })()}
    </section>
  );
}
