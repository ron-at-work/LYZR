"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/** Primary (ink) + secondary (mist) — text sits on cream with the mark over it. */
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
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (reduce || !stageRef.current || !sectionRef.current) return;

    const words = stageRef.current.querySelectorAll<HTMLElement>(".cine-about-word");
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: (i, el) => (el.classList.contains("is-mist") ? 0.28 : 0.18) });
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.07,
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 0.55,
          pin: true,
          anticipatePin: 1,
        },
      });
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

      <div className="cine-about-stage" ref={stageRef}>
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
