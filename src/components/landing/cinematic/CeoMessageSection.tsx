"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

export function CeoMessageSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!ref.current) return;
    const section = ref.current;
    const label = section.querySelector<HTMLElement>(".cine-ceo-label");
    const quote = section.querySelector<HTMLElement>(".cine-ceo-quote");
    const meta = section.querySelector<HTMLElement>(".cine-ceo-meta");
    const portrait = section.querySelector<HTMLElement>(".cine-ceo-portrait");

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([label, quote, meta, portrait], { clearProps: "all", opacity: 1, y: 0, x: 0 });
        return;
      }

      gsap.set(label, { opacity: 0, y: 16 });
      gsap.set(quote, { opacity: 0, y: 36 });
      gsap.set(meta, { opacity: 0, y: 20 });
      gsap.set(portrait, { opacity: 0, x: 40, scale: 1.04 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
        .to(quote, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, 0.08)
        .to(meta, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.28)
        .to(
          portrait,
          { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out" },
          0.12,
        );
    }, ref);

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
    <section className="cine-ceo" id="ceo" ref={ref}>
      <p className="cine-side-label">CEO</p>

      <div className="cine-ceo-grid">
        <div className="cine-ceo-copy">
          <p className="cine-ceo-label">A note from the founder</p>
          <blockquote className="cine-ceo-quote">
            Most agent platforms sell tools and leave teams alone with the hard parts. We operate
            like <em>Palantir for the agent era</em>: platform plus forward-deployed engineers,
            inside your VPC, until you are in production.
          </blockquote>
          <div className="cine-ceo-meta">
            <div>
              <p className="cine-ceo-name">Siva Surendira</p>
              <p className="cine-ceo-role">Founder &amp; CEO, Lyzr</p>
            </div>
            <a className="cine-link" href="https://www.lyzr.ai/book-demo/">
              Talk to leadership <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <figure className="cine-ceo-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Siva Surendira, Founder and CEO of Lyzr AI"
            decoding="async"
            height={640}
            loading="lazy"
            src="/founders/siva-surendira.jpg"
            width={640}
          />
          <figcaption>
            <span>01</span>
            <span>Leadership</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
