'use client';

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "../data";

export function TestimonialsCarousel({ items }: { items: readonly Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = items.length;

  const syncIndex = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-t-card]"));
    if (!cards.length) return;
    const left = track.scrollLeft;
    let best = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft <= left + card.offsetWidth * 0.35) best = i;
    });
    setIndex(best);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncIndex();
    track.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex);
    return () => {
      track.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
    };
  }, []);

  const scrollTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-t-card]");
    const clamped = Math.max(0, Math.min(total - 1, next));
    const target = cards[clamped];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    setIndex(clamped);
  };

  const pad = String(index + 1).padStart(2, "0");
  const padTotal = String(total).padStart(2, "0");

  return (
    <div className="testimonials-carousel">
      <div className="testimonials-toolbar">
        <span className="testimonials-count font-mono text-[12px] tracking-widest text-text-muted" aria-live="polite">
          {pad} <span className="text-text-faint">/</span> {padTotal}
        </span>
        <div className="testimonials-controls">
          <button
            aria-label="Previous testimonial"
            className="testimonials-nav-btn"
            disabled={index <= 0}
            onClick={() => scrollTo(index - 1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <button
            aria-label="Next testimonial"
            className="testimonials-nav-btn"
            disabled={index >= total - 1}
            onClick={() => scrollTo(index + 1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div
        aria-label="Customer testimonials"
        className="testimonials-track"
        ref={trackRef}
        role="region"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollTo(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollTo(index - 1);
          }
        }}
      >
        {items.map((t, i) => (
          <article
            className={`testimonials-panel${i === index ? " is-active" : ""}`}
            data-t-card
            key={`${t.company}-${t.role}`}
          >
            <div className="flex items-baseline gap-3 mb-space-24">
              <span className="testimonials-metric font-display text-[48px] md:text-[56px] leading-none tracking-[-0.04em] text-primary">
                {t.metric}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted max-w-[8.5rem] leading-snug">
                {t.metricLabel}
              </span>
            </div>
            <blockquote className="testimonials-quote font-display text-[20px] md:text-[22px] font-medium tracking-[-0.02em] text-text-primary leading-[1.3] pb-1 flex-1">
              “{t.quote}”
            </blockquote>
            <footer className="testimonials-footer mt-space-24 pt-space-16 flex items-center gap-3">
              <div className="testimonials-avatar" aria-hidden="true">
                {t.initials}
              </div>
              <div>
                <span className="text-[14px] font-semibold text-text-primary block">{t.role}</span>
                <span className="text-[12px] font-mono text-text-muted">{t.company}</span>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
