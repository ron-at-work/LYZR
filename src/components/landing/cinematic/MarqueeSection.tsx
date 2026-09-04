"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["Design", "Build", "Govern", "Ship", "Scale"] as const;

export function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const root = ref.current;
    const track = root.querySelector<HTMLElement>(".cine-marquee-track");
    const cuts = root.querySelectorAll<HTMLElement>(".cine-marquee-cut");

    const ctx = gsap.context(() => {
      if (track) {
        gsap.to(track, {
          xPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      // Horizontal light slabs that cut through the marquee (Trionn-style)
      gsap.fromTo(
        cuts,
        { scaleY: 0, transformOrigin: "50% 0%" },
        {
          scaleY: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: root,
            start: "center center",
            end: "bottom top",
            scrub: 0.45,
          },
        },
      );
    }, ref);

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
    <section className="cine-marquee" id="vision" ref={ref}>
      <p className="cine-marquee-sub">
        Focused vision.
        <br />
        Measured execution.
      </p>
      <div className="cine-marquee-mask">
        <div className="cine-marquee-track">
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={`${w}-${i}`}>
              {w} <em>+</em>
            </span>
          ))}
        </div>
      </div>

      <div aria-hidden className="cine-marquee-cuts">
        <span className="cine-marquee-cut" />
        <span className="cine-marquee-cut" />
        <span className="cine-marquee-cut" />
      </div>

      <p className="cine-marquee-cue">
        ✦ From idea to outcome.
        <span aria-hidden>▾</span>
      </p>
    </section>
  );
}
