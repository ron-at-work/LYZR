import { KNOWLEDGE_RESOURCES, KNOWLEDGE_TRUST_BADGES, NAV_EXT } from "../data";

export function KnowledgeSection() {
  return (
    <>
      {/* 13. COMPREHENSIVE RESOURCES, TEMPLATES & COMMUNITY */}
      <section className="kb-section w-full bg-brand-ink border-y border-border-crisp section-y scroll-mt-28" id="playbooks">
        <div className="max-w-container-max mx-auto page-pad">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-16 mb-space-48">
            <div className="min-w-0 max-w-3xl">
              <span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">Knowledge Base</span>
              <h2 className="font-display display-h2 font-medium text-text-primary">
                Enterprise blueprints &amp;{" "}
                <span className="font-editorial-italic text-primary display-em">production playbooks.</span>
              </h2>
            </div>
            <div className="shrink-0">
              <span className="text-[12px] font-mono text-text-muted">Updated weekly for platform engineers</span>
            </div>
          </div>
          <div className="kb-grid">
            {KNOWLEDGE_RESOURCES.map((resource) => (
              <a
                className="kb-card group"
                href={resource.href}
                key={resource.title}
                {...NAV_EXT}
              >
                <span className="kb-card-meta">{resource.meta}</span>
                <h3 className="kb-card-title">{resource.title}</h3>
                <p className="kb-card-body">{resource.body}</p>
                <span className="kb-card-cta">
                  {resource.cta}
                  <svg aria-hidden className="kb-card-arrow" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
          <a
            className="kb-trust group"
            href="https://security.lyzr.ai/"
            {...NAV_EXT}
          >
            <div className="kb-trust-copy">
              <svg aria-hidden className="kb-trust-icon" fill="none" viewBox="0 0 24 24">
                <path d="M12 3.5 5.5 6.25v4.4c0 4.35 2.85 8.25 6.5 9.85 3.65-1.6 6.5-5.5 6.5-9.85v-4.4L12 3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
                <path d="m9.25 12 1.85 1.85L14.75 10.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <div className="min-w-0">
                <span className="kb-trust-title">Enterprise Trust &amp; Continuous Security</span>
                <span className="kb-trust-sub">Third-party verified compliance across every layer of the sovereign runtime.</span>
              </div>
            </div>
            <div className="kb-trust-badges">
              {KNOWLEDGE_TRUST_BADGES.map((badge) => (
                <span className="kb-trust-badge" key={badge}>{badge}</span>
              ))}
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
