import { TESTIMONIALS } from "../data";
import { TestimonialsCarousel } from "../carousels";

export function TestimonialsSection() {
  return (
    <>
      {/* 9. EXECUTIVE TESTIMONIALS */}
      <section className="testimonials-section w-full bg-brand-ink border-y border-border-crisp section-y" id="testimonials">
        <div className="max-w-container-max mx-auto page-pad">
          <div className="max-w-3xl mb-space-48">
            <h2 className="font-display display-h2 font-semibold text-text-primary pb-1">
              Why they chose Lyzr.
            </h2>
            <p className="text-[16px] text-text-secondary mt-space-12 leading-relaxed max-w-[42ch]">
              Engineering and digital leaders shipping agents past the demo into production.
            </p>
          </div>
          <TestimonialsCarousel items={TESTIMONIALS} />
        </div>
      </section>
    </>
  );
}
