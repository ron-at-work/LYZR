export function CtaSection() {
  return (
    <>
      {/* 14. RAMP-INSPIRED MINIMAL HIGH-CONVERSION FOOTER CTA */}
      <section className="w-full max-w-container-max mx-auto page-pad section-y" id="get-started">
        <div className="cta-panel bg-brand-ink border border-border-crisp rounded-3xl p-space-48 md:p-space-80 text-center flex flex-col items-center shadow-sm relative overflow-hidden">
          <span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold mb-space-16">Deterministic Execution</span>
          <h2 className="font-display display-cta font-medium text-text-primary max-w-3xl mb-space-24">
            8 weeks from concept to{" "}
            <span className="font-editorial-italic text-primary display-em-cta">agents in production.</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-text-secondary max-w-2xl mb-space-40 leading-relaxed font-normal">
            Bring your existing LLM weights, framework code, and compliance mandates. We will demonstrate the exact architecture to make it sovereign and live.
          </p>
          {/* Precision Dual Action / Email Input Row */}
          <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 bg-surface-card border border-border-crisp p-1.5 rounded-xl shadow-sm">
            <input className="w-full px-space-16 h-11 bg-transparent text-text-primary placeholder:text-text-faint text-[14px] focus:outline-none focus:ring-0 border-0" placeholder="name@company.com" type="email"/>
            <button className="w-full sm:w-auto shrink-0 px-space-20 h-11 btn-brand text-[13.5px] font-medium rounded-lg transition-all shadow-sm" type="button">
              Get Started
            </button>
          </div>
          <span className="text-[12px] font-mono text-text-faint mt-space-16">No credit card required • Enterprise NDA executed on request • VPC Native</span>
        </div>
      </section>
    </>
  );
}
