"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

/** Primary (ink) + secondary (mist) — letter-by-letter read on scroll. */
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

function WordChars({
  word,
  mist,
  keyPrefix,
}: {
  word: string;
  mist?: boolean;
  keyPrefix: string;
}) {
  return (
    <span className={`cine-about-word${mist ? " is-mist" : ""}`}>
      {Array.from(word).map((ch, i) => (
        <span className="cine-about-char" aria-hidden key={`${keyPrefix}-${i}`}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (reduce || !sectionRef.current) return;

    const section = sectionRef.current;
    const chars = section.querySelectorAll<HTMLElement>(".cine-about-char");
    const mistChars = section.querySelectorAll<HTMLElement>(
      ".cine-about-word.is-mist .cine-about-char",
    );
    const caret = section.querySelector<HTMLElement>(".cine-about-read-caret");

    if (!chars.length) return;

    const ctx = gsap.context(() => {
      // Unread = nearly invisible; scroll inks one letter at a time
      gsap.set(chars, { opacity: 0.08 });
      gsap.set(mistChars, { color: "rgba(22, 22, 22, 0.4)" });
      if (caret) gsap.set(caret, { opacity: 0 });

      const pinDistance = () => {
        const vh = window.innerHeight;
        const w = window.innerWidth;
        if (w < 720) return Math.round(vh * Math.max(1.35, chars.length * 0.028));
        if (w < 960) return Math.round(vh * Math.max(2, chars.length * 0.036));
        return Math.round(vh * Math.max(2.8, chars.length * 0.045));
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: pinDistance,
          scrub: 0.35,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 — each letter inks in sequence (reads like typing while scrolling)
      tl.to(
        chars,
        {
          opacity: 1,
          ease: "none",
          stagger: { each: 0.028, from: "start" },
          duration: 0.028,
        },
        0,
      );
      tl.to(
        mistChars,
        {
          color: "#161616",
          ease: "none",
          stagger: { each: 0.028, from: "start" },
          duration: 0.028,
        },
        0.02,
      );

      // Reading caret tracks the reveal head
      if (caret) {
        const moveCaret = (index: number) => {
          const el = chars[Math.min(index, chars.length - 1)];
          if (!el) return;
          const stage = section.querySelector<HTMLElement>(".cine-about-stage");
          if (!stage) return;
          const sr = stage.getBoundingClientRect();
          const cr = el.getBoundingClientRect();
          gsap.set(caret, {
            opacity: 1,
            x: cr.right - sr.left + 2,
            y: cr.top - sr.top,
            height: cr.height * 0.85,
          });
        };

        moveCaret(0);
        tl.to(
          {},
          {
            duration: chars.length * 0.028,
            ease: "none",
            onUpdate() {
              const p = this.progress();
              const idx = Math.floor(p * chars.length);
              moveCaret(idx);
            },
          },
          0,
        );
        tl.to(caret, { opacity: 0, duration: 0.12, ease: "none" }, ">-0.02");
      }

      // Phase 2 — hold fully readable before unpin
      tl.to({}, { duration: 0.85 });
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
              <WordChars word={word} keyPrefix={`p-${wi}`} key={`p-${wi}`} />
            ))}
          </span>
          <span className="cine-about-line is-mist">
            {SECONDARY.map((word, wi) => (
              <WordChars word={word} mist keyPrefix={`s-${wi}`} key={`s-${wi}`} />
            ))}
          </span>
        </h2>
        <span aria-hidden className="cine-about-read-caret" />
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
