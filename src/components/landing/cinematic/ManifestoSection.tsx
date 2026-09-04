"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/** Primary (ink) + secondary (mist) — full sentence must finish before the next section may enter. */
const PRIMARY = ["Lyzr", "is", "the", "enterprise", "control", "plane", "for", "agents"] as const;
const SECONDARY = [
  "crafting",
  "production",
  "AI",
  "through",
  "strategy,",
  "design,",
  "and",
  "technology.",
] as const;

const FLAT = [...PRIMARY, ...SECONDARY];

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (reduce || !sectionRef.current) return;

    const section = sectionRef.current;
    const words = section.querySelectorAll<HTMLElement>(".cine-about-word");
    const mist = section.querySelectorAll<HTMLElement>(".cine-about-word.is-mist");

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.2 });
      gsap.set(mist, { color: "rgba(22, 22, 22, 0.4)" });

      // Pin the WHOLE about section so the marquee cannot rise until the sentence is fully read.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
          scrub: 0.45,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 — ink the full sentence (Lyzr → technology.)
      tl.to(
        words,
        {
          opacity: 1,
          ease: "none",
          stagger: { each: 0.035, from: "start" },
          duration: 0.55,
        },
        0,
      );
      tl.to(
        mist,
        {
          color: "#161616",
          ease: "none",
          stagger: { each: 0.035, from: "start" },
          duration: 0.55,
        },
        0.05,
      );

      // Phase 2 — hold: sentence stays fully readable; next section still locked out
      tl.to({}, { duration: 1.15 });
    }, sectionRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [reduce]);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return (
    <section className="cine-about" id="about" ref={sectionRef}>
      <p className="cine-side-label">About</p>

      <div className="cine-about-stage">
        <h2 className="cine-about-copy" aria-label={FLAT.join(" ")}>
          <span className="cine-about-line is-ink">
            {PRIMARY.map((word, wi) => (
              <span className="cine-about-word" key={`p-${wi}`}>
                {word}
              </span>
            ))}
          </span>
          <span className="cine-about-line is-mist">
            {SECONDARY.map((word, wi) => (
              <span className="cine-about-word is-mist" key={`s-${wi}`}>
                {word}
              </span>
            ))}
          </span>
        </h2>
        <span aria-hidden className="cine-cursor-mark" />
      </div>

      <div className="cine-about-foot">
        <p className="cine-about-mantra">
          We design for longevity.
          <br />
          Clarity first, craft always, built to scale.
        </p>
        <div className="cine-about-mission">
          <p>
            Our mission is to make agents feel trustworthy by shipping digital workers that are
            governed, purposeful, and meaningful in the enterprise.
          </p>
          <a className="cine-link" href="#services">
            More about us <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
