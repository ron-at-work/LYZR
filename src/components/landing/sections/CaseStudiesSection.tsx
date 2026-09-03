import { CASE_STUDIES } from "../data";
import { CaseStudiesCarousel } from "../carousels";

export function CaseStudiesSection() {
  return (
    <>
      {/* 9. DEEP CASE STUDIES & REAL ENTERPRISE PROOF */}
      <section className="w-full bg-surface-subtle border-b border-border-crisp section-y overflow-hidden" id="customers">
        <div className="max-w-container-max mx-auto page-pad">
          <div className="flex flex-col mb-space-40 max-w-3xl">
            <h2 className="font-display display-h2-lg font-medium text-text-primary">
              Agents running at scale.{" "}
              <span className="font-editorial-italic">Not just tech demos.</span>
            </h2>
            <p className="text-[15px] text-text-secondary mt-space-16 leading-relaxed max-w-2xl">
              Verified production metrics realized across corporate venture capital, actuarial retirement advisory, commercial aviation, and fintech operations.
            </p>
          </div>
          <CaseStudiesCarousel items={CASE_STUDIES} />
        </div>
      </section>
    </>
  );
}
