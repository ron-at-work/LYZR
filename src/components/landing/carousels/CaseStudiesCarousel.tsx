'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { CaseStudy } from "../data";

export function CaseStudiesCarousel({ items }: { items: readonly CaseStudy[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userHeld, setUserHeld] = useState(false);
  const resumeTimer = useRef<number | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const total = items.length;
  const paused = hovered || userHeld;

  const holdBriefly = () => {
    setUserHeld(true);
    if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setUserHeld(false), 1800);
  };

  const syncIndex = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-case-card]"));
    if (!cards.length) return;
    const left = track.scrollLeft;
    let best = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft <= left + card.offsetWidth * 0.4) best = i;
    });
    setIndex(best);
  };

  const scrollTo = (next: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-case-card]");
    const clamped = ((next % total) + total) % total;
    const target = cards[clamped];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft, behavior });
    setIndex(clamped);
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

  useEffect(() => {
    return () => {
      if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (paused || total <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % total;
        const track = trackRef.current;
        if (track) {
          const cards = track.querySelectorAll<HTMLElement>("[data-case-card]");
          const target = cards[next];
          if (target) track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 4200);

    return () => window.clearInterval(id);
  }, [paused, total]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || e.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
    setUserHeld(true);
    track.setPointerCapture(e.pointerId);
    track.classList.add("is-dragging");
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) return;
    const delta = e.clientX - drag.startX;
    if (Math.abs(delta) > 6) drag.moved = true;
    track.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) return;
    drag.active = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    syncIndex();
    if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setUserHeld(false), 900);
  };

  const pad = String(index + 1).padStart(2, "0");
  const padTotal = String(total).padStart(2, "0");

  return (
    <div
      className="case-studies-carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
      }}
    >
      <div className="case-studies-toolbar">
        <span className="font-mono text-[12px] tracking-widest text-text-muted" aria-live="polite">
          {pad} <span className="text-text-faint">/</span> {padTotal}
          <span className="ml-3 text-[11px] tracking-[0.08em] uppercase text-text-faint">
            {paused ? "Paused" : "Auto"}
          </span>
        </span>
        <div className="case-studies-controls">
          <button
            aria-label="Previous case study"
            className="case-studies-nav-btn"
            onClick={() => {
              holdBriefly();
              scrollTo(index - 1);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <button
            aria-label="Next case study"
            className="case-studies-nav-btn"
            onClick={() => {
              holdBriefly();
              scrollTo(index + 1);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div
        aria-label="Enterprise case studies"
        className="case-studies-track"
        ref={trackRef}
        role="region"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            holdBriefly();
            scrollTo(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            holdBriefly();
            scrollTo(index - 1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((card, i) => (
          <article
            className={`case-studies-card${i === index ? " is-active" : ""}`}
            data-case-card
            key={card.company}
          >
            <div>
              <div className="flex justify-between items-start gap-3 mb-5">
                <span className="text-[15px] font-semibold tracking-tight text-text-primary">
                  {card.company}
                </span>
                <span className="shrink-0 px-2 py-1 rounded-md bg-surface-inset text-[10px] font-medium uppercase tracking-[0.06em] text-ink-muted">
                  {card.badge}
                </span>
              </div>
              <p className="text-[14px] text-text-muted italic leading-[1.65]">
                &ldquo;{card.quote}&rdquo;
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border-crisp grid grid-cols-2 gap-4">
              {card.metrics.map((metric) => (
                <div key={metric.label}>
                  <span className="block text-[28px] font-semibold tracking-tight text-text-primary leading-none">
                    {metric.value}
                  </span>
                  <span className="block mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-text-faint">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
