'use client';

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const STACK = ["Studio", "Architect", "Deploy", "Govern"] as const;

const SERVICES = [
  {
    title: "Agent design",
    body: "Thoughtful agent design that captures attention, deepens engagement, and earns lasting trust.",
  },
  {
    title: "Control plane",
    body: "Impactful governance positions enterprises for success through clarity, audit, and lasting loyalty.",
  },
] as const;

export function CapabilitiesStack() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const words = ref.current.querySelectorAll<HTMLElement>(".cine-svc-word");
    const slab = ref.current.querySelector<HTMLElement>(".cine-svc-slab");

    const ctx = gsap.context(() => {
      gsap.to(words, {
        yPercent: -120,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=140%",
          scrub: true,
          pin: true,
        },
      });
      if (slab) {
        gsap.fromTo(
          slab,
          { scale: 0.86, rotate: -4 },
          {
            scale: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "+=140%",
              scrub: true,
            },
          },
        );
      }
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
    <section className="cine-services" id="services" ref={ref}>
      <p className="cine-svc-label">Our platform</p>

      <div className="cine-svc-stage">
        <div className="cine-svc-words" aria-hidden>
          {STACK.map((w) => (
            <span className="cine-svc-word" key={w}>
              {w}
            </span>
          ))}
        </div>
        <div className="cine-svc-slab">
          <span className="cine-svc-carve" />
        </div>
      </div>

      <p className="cine-svc-tag">✦ Different disciplines. One standard of craft.</p>

      <div className="cine-svc-grid">
        {SERVICES.map((s) => (
          <article key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        ))}
      </div>

      <a className="cine-link cine-svc-link" href="#motion">
        View services <span aria-hidden>→</span>
      </a>
    </section>
  );
}
