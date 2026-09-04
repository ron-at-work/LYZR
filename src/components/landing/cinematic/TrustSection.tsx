"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";
import { useSound } from "../motion/SoundProvider";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    label: "Featured & awards",
    body: "Trusted by Accenture, NVIDIA, AWS, Azure, and Google Cloud.",
    stat: "40+",
    tone: "dark",
    image: "/landing/fact-awards.jpg",
    imageAlt: "Chrome Lyzr mark sculpture with warm amber light",
  },
  {
    label: "Agents governed",
    body: "90% of enterprise teams expand after the first production rollout.",
    stat: "1.2K+",
    tone: "light",
    image: null,
    imageAlt: "",
  },
  {
    label: "POC-to-prod",
    body: "Governance first. Scale always. Conversion that actually ships.",
    stat: "95%",
    tone: "mid",
    image: "/landing/fact-team.jpg",
    imageAlt: "Silhouette figure with agent shards in architectural light",
  },
] as const;

export function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const { playHover } = useSound();

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>(".cine-fact-card");
    const title = ref.current.querySelector<HTMLElement>(".cine-facts-head");

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([title, cards], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set(cards, { yPercent: -120, opacity: 0, rotate: -4 });
      gsap.set(title, { opacity: 0, y: 28 });

      // Drop from above once (Trionn-style), not endlessly scrubbed
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      }).to(
        cards,
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
        },
        0.08,
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
    <section className="cine-facts" id="facts" ref={ref}>
      <div className="cine-facts-head">
        <h2>Key facts</h2>
        <p className="cine-facts-sub">A snapshot of our experience and impact.</p>
      </div>

      <div className="cine-facts-row">
        {CARDS.map((card, i) => (
          <article
            className={`cine-fact-card is-${card.tone}`}
            key={card.label}
            onFocus={() => playHover(0.75 + i * 0.12)}
            onMouseEnter={() => playHover(0.75 + i * 0.12)}
          >
            <p className="cine-fact-label">{card.label}</p>

            {card.image ? (
              <div className="cine-fact-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={card.imageAlt} src={card.image} />
              </div>
            ) : (
              <div className="cine-fact-orb" aria-hidden>
                <strong>{card.stat}</strong>
              </div>
            )}

            <div className="cine-fact-body">
              <p>{card.body}</p>
              {card.image ? <strong>{card.stat}</strong> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
