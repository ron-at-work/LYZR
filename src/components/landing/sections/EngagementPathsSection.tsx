export function EngagementPathsSection() {
  return (
    <>
      {/* 12. THREE ON-BOARDING PATHS */}
      <section className="w-full max-w-container-max mx-auto page-pad section-y">
        <div className="text-center max-w-3xl mx-auto mb-space-40 md:mb-space-64">
          <span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">Engagement Models</span>
          <h2 className="font-display display-h2 font-medium text-text-primary">
            Three flexible paths to <span className="font-editorial-italic text-primary display-em">production.</span>
          </h2>
          <p className="text-[16px] text-text-secondary mt-space-12">
            Choose the right partnership velocity based on internal engineering capacity and strategic speed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-24">
          {/* Path 01 */}
          <div className="path-card border border-border-crisp rounded-xl p-space-32 bg-surface-card flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-mono text-text-muted uppercase">PATH 01</span>
              <h3 className="text-[20px] font-semibold text-text-primary mt-2 mb-3">Platform + Your Team</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed mb-space-24">
                Your engineers build directly on Lyzr Agent Studio, Python SDK, and Control Plane. Full self-service with standard enterprise SLAs and technical documentation.
              </p>
            </div>
            <div className="pt-space-16 border-t border-border-subtle">
              <span className="text-[12px] font-mono text-text-primary font-medium block mb-1">Ideal for:</span>
              <span className="text-[13px] text-text-muted">Self-sufficient AI platform teams with internal infrastructure.</span>
            </div>
          </div>
          {/* Path 02 */}
          <div className="path-card border-2 border-primary rounded-xl p-space-32 bg-surface-card flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-mono font-bold tracking-wider uppercase">
              MOST POPULAR
            </div>
            <div>
              <span className="text-[11px] font-mono text-primary uppercase font-bold">PATH 02</span>
              <h3 className="text-[20px] font-semibold text-text-primary mt-2 mb-3">Platform + Lyzr Engineers</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed mb-space-24">
                Forward-Deployed Engineers embed with your team to co-build your first 3 production agents. Guaranteed 8-week production SLA in your sovereign VPC.
              </p>
            </div>
            <div className="pt-space-16 border-t border-border-subtle">
              <span className="text-[12px] font-mono text-text-primary font-medium block mb-1">Ideal for:</span>
              <span className="text-[13px] text-text-muted">Enterprises needing accelerated speed-to-market without compliance roadblocks.</span>
            </div>
          </div>
          {/* Path 03 */}
          <div className="path-card border border-border-crisp rounded-xl p-space-32 bg-surface-card flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-mono text-text-muted uppercase">PATH 03</span>
              <h3 className="text-[20px] font-semibold text-text-primary mt-2 mb-3">Expert Partner Ecosystem</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed mb-space-24">
                Work with our certified Global Systems Integrator (GSI) and consultancy partners (Accenture, PwC, Wipro) who have certified practices on Lyzr architectures.
              </p>
            </div>
            <div className="pt-space-16 border-t border-border-subtle">
              <span className="text-[12px] font-mono text-text-primary font-medium block mb-1">Ideal for:</span>
              <span className="text-[13px] text-text-muted">Large transformational rollouts spanning multiple corporate subsidiaries.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
