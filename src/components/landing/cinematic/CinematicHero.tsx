"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { HeroMark } from "./HeroMark";
import { InteractiveLines } from "./InteractiveLines";

/** Rotating emphasis — Lyzr product outcomes, not agency filler. */
const WORDS = ["production.", "your VPC.", "enterprise.", "governance.", "scale."] as const;

export function CinematicHero() {
  const reduce = useReducedMotion();
  const [blast, setBlast] = useState(false);
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setWord((w) => (w + 1) % WORDS.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section className="cine-hero" id="top">
      <HeroMark blast={blast} className="cine-symbol-canvas" />
      <InteractiveLines blast={blast} />

      <div className="cine-hero-ui">
        <div className="cine-hero-left">
          <p className="cine-hero-kicker">Lyzr · Agent infrastructure</p>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            initial={reduce ? false : { opacity: 0, y: 36 }}
            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="cine-hero-line">Take AI agents to</span>
            <span className="cine-hero-swap">
              <AnimatePresence mode="wait">
                <motion.em
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(14px)", y: -10 }}
                  initial={reduce ? false : { opacity: 0, filter: "blur(14px)", y: 14 }}
                  key={WORDS[word]}
                  transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                >
                  {WORDS[word]}
                </motion.em>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="cine-hero-lead"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            transition={{ delay: 0.08, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            The enterprise platform to design, build, simulate, deploy, and govern a secure AI
            workforce — end to end.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="cine-cta-row"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            transition={{ delay: 0.14, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <a className="cine-link" href="https://www.lyzr.ai/book-demo/">
              Get started <span aria-hidden>→</span>
            </a>
            <a className="cine-link" href="https://www.lyzr.ai/book-demo/">
              Book a demo <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>

        <button
          aria-label="Scroll to about"
          className="cine-scroll-hint"
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          type="button"
        >
          <span />
        </button>

        <p
          className="cine-hold"
          onPointerDown={(e) => {
            e.preventDefault();
            setBlast(true);
          }}
          onPointerLeave={() => setBlast(false)}
          onPointerUp={() => setBlast(false)}
          onPointerCancel={() => setBlast(false)}
        >
          Scroll to explore
          <br />
          Hold to expand the mark
        </p>

        <aside className="cine-hero-meta">
          <div className="cine-hero-meta-row">
            <span className="cine-globe" aria-hidden />
            <div>
              <strong>In production</strong>
              <p>1.2K+ agents governed on Lyzr</p>
            </div>
          </div>
          <p className="cine-hero-desc">
            Studio, Architect, and a control plane for LangChain, Bedrock, Azure, and custom agents
            in your VPC.
          </p>
        </aside>
      </div>
    </section>
  );
}
