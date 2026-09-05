"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { TESTIMONIALS, TRUSTED_LOGOS } from "../data";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";
import { useSound } from "../motion/SoundProvider";

gsap.registerPlugin(ScrollTrigger);

const LOGO_POOL = TRUSTED_LOGOS;
const LOGO_SLOT_COUNT = 6;
const LOGO_SWAP_MS = 1600;
const LOGO_FADE_MS = 140;

type TrustedLogo = (typeof TRUSTED_LOGOS)[number];

function pickNextLogoIndex(current: number[], slot: number, poolSize: number) {
  const used = new Set(current.filter((_, i) => i !== slot));
  let candidate = (current[slot] + 1) % poolSize;
  for (let n = 0; n < poolSize; n += 1) {
    if (!used.has(candidate)) return candidate;
    candidate = (candidate + 1) % poolSize;
  }
  return candidate;
}

function RotatingLogoTile({
  logo,
  slot,
  fading,
}: {
  logo: TrustedLogo;
  slot: number;
  fading: boolean;
}) {
  const inner = (
    <>
      <span className="cine-companies-index" aria-hidden>
        {String(slot + 1).padStart(2, "0")}
      </span>
      <span className={`cine-companies-logo${fading ? " is-fading" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={logo.name} height={32} loading="lazy" src={logo.src} width={120} />
      </span>
    </>
  );

  return (
    <li className="cine-companies-tile">
      {"href" in logo && logo.href ? (
        <a href={logo.href} aria-label={`${logo.name} — read customer story`}>
          {inner}
        </a>
      ) : (
        <div>{inner}</div>
      )}
    </li>
  );
}

export function CompaniesSection() {
  const ref = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const { playHover } = useSound();
  const [index, setIndex] = useState(0);
  const [logoIndexes, setLogoIndexes] = useState(() =>
    Array.from({ length: LOGO_SLOT_COUNT }, (_, i) => i % LOGO_POOL.length),
  );
  const [fadingSlot, setFadingSlot] = useState<number | null>(null);
  const swapTick = useRef(0);
  const total = TESTIMONIALS.length;
  const active = TESTIMONIALS[index];

  const go = useCallback(
    (next: number) => {
      const clamped = ((next % total) + total) % total;
      setIndex(clamped);
      playHover(0.7 + (clamped % 5) * 0.08);
    },
    [playHover, total],
  );

  useEffect(() => {
    if (reduce) return;

    let fadeTimer: number | undefined;
    const interval = window.setInterval(() => {
      const slot = swapTick.current % LOGO_SLOT_COUNT;
      swapTick.current += 1;
      setFadingSlot(slot);

      fadeTimer = window.setTimeout(() => {
        setLogoIndexes((prev) => {
          const next = [...prev];
          next[slot] = pickNextLogoIndex(prev, slot, LOGO_POOL.length);
          return next;
        });
        setFadingSlot(null);
      }, LOGO_FADE_MS);
    }, LOGO_SWAP_MS);

    return () => {
      window.clearInterval(interval);
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, [reduce]);

  useEffect(() => {
    if (!quoteRef.current || reduce) return;
    gsap.fromTo(
      quoteRef.current.querySelectorAll(".cine-t-anim"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" },
    );
  }, [index, reduce]);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const head = root.querySelector<HTMLElement>(".cine-companies-head");
    const tiles = root.querySelectorAll<HTMLElement>(".cine-companies-tile");
    const stage = root.querySelector<HTMLElement>(".cine-companies-stage");

    const mm = gsap.matchMedia();

    mm.add("(max-width: 719px)", () => {
      if (reduce) {
        gsap.set([head, tiles, stage], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set([head, tiles, stage], { opacity: 1, y: 0 });

      if (!stage) return;

      ScrollTrigger.create({
        trigger: stage,
        start: "top top+=56",
        end: () => `+=${Math.round(window.innerHeight * Math.max(1.6, total * 0.45))}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const idx = Math.min(total - 1, Math.floor(self.progress * total * 0.999));
          setIndex((prev) => (prev === idx ? prev : idx));
        },
      });
    });

    mm.add("(min-width: 720px)", () => {
      if (reduce) {
        gsap.set([head, tiles, stage], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set(head, { opacity: 0, y: 28 });
      gsap.set(tiles, { opacity: 0, y: 16 });
      gsap.set(stage, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 76%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(head, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
        .to(
          tiles,
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: "power3.out" },
          0.12,
        )
        .to(stage, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.28);
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [reduce, total]);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return (
    <section className="cine-companies" id="companies" ref={ref}>
      <div className="cine-companies-head">
        <div className="cine-companies-head-copy">
          <p className="cine-companies-kicker">Trusted companies</p>
          <h2>Trusted by teams shipping agents in regulated production.</h2>
        </div>
        <div className="cine-companies-head-aside">
          <p>
            Systems integrators, banks, and airlines run production-grade agent fleets on Lyzr every
            day.
          </p>
          <a className="cine-link" href="#testimonials">
            Read customer stories <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      <ul className="cine-companies-roster" aria-label="Trusted companies">
        {logoIndexes.map((logoIndex, slot) => (
          <RotatingLogoTile
            fading={fadingSlot === slot}
            key={`slot-${slot}`}
            logo={LOGO_POOL[logoIndex]}
            slot={slot}
          />
        ))}
      </ul>

      <div className="cine-companies-stage" id="testimonials">
        <div className="cine-companies-stage-bar">
          <p className="cine-companies-kicker">Why they chose Lyzr</p>
          <div className="cine-companies-nav">
            <span className="cine-companies-count" aria-live="polite">
              {String(index + 1).padStart(2, "0")}
              <span aria-hidden> / </span>
              {String(total).padStart(2, "0")}
            </span>
            <button
              aria-label="Previous testimonial"
              className="cine-companies-btn"
              onClick={() => go(index - 1)}
              type="button"
            >
              ←
            </button>
            <button
              aria-label="Next testimonial"
              className="cine-companies-btn"
              onClick={() => go(index + 1)}
              type="button"
            >
              →
            </button>
          </div>
        </div>

        <article
          className="cine-companies-quote"
          key={`${active.company}-${active.role}`}
          ref={quoteRef}
        >
          <div className="cine-companies-metric cine-t-anim">
            <strong>{active.metric}</strong>
            <span>{active.metricLabel}</span>
          </div>

          <blockquote className="cine-t-anim">“{active.quote}”</blockquote>

          <footer className="cine-companies-attrib cine-t-anim">
            <span className="cine-companies-avatar" aria-hidden>
              {active.initials}
            </span>
            <div>
              <p className="cine-companies-role">{active.role}</p>
              <p className="cine-companies-org">{active.company}</p>
            </div>
          </footer>
        </article>

        <div
          aria-label="Jump to testimonial"
          className="cine-companies-dots"
          role="tablist"
        >
          {TESTIMONIALS.map((t, i) => (
            <button
              aria-label={`${t.company} — ${t.role}`}
              aria-selected={i === index}
              className={`cine-companies-dot${i === index ? " is-on" : ""}`}
              key={`${t.company}-${t.role}`}
              onClick={() => go(i)}
              role="tab"
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
