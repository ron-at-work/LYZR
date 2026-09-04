'use client';

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
    const track = ref.current.querySelector<HTMLElement>(".cine-marquee-track");
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
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
    <section className="cine-marquee" ref={ref}>
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
    </section>
  );
}
