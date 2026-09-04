'use client';

import { motion, useReducedMotion } from "motion/react";

const TILES = [
  { title: "Loose sketches to visualizations", tone: "a" },
  { title: "We bring imagination to life.", tone: "b" },
  { title: "Style defines character.", tone: "c" },
  { title: "Choose your case", tone: "d" },
  { title: "2026", tone: "e" },
  { title: "Agent fashion studio", tone: "f" },
] as const;

export function QuoteSection() {
  const reduce = useReducedMotion();

  return (
    <section className="cine-motion" id="motion">
      <div className="cine-motion-head">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span>Design in</span>
          <span>motion</span>
        </motion.h2>
        <p className="cine-motion-center">Exploring ideas through daily design practice.</p>
      </div>

      <div className="cine-motion-grid">
        {TILES.map((t, i) => (
          <motion.article
            className={`cine-motion-tile is-${t.tone}`}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            key={t.title}
            transition={{ delay: i * 0.05, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p>{t.title}</p>
          </motion.article>
        ))}
      </div>

      <div className="cine-motion-foot">
        <p>Concepts, explorations, and interface experiments shared openly as part of our creative process.</p>
        <a className="cine-link" href="https://www.lyzr.ai/blog/">
          View on blog <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
