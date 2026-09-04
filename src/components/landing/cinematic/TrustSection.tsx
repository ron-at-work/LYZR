'use client';

import { motion, useReducedMotion } from "motion/react";

const CARDS = [
  {
    label: "Featured & awards",
    body: "Trusted by Accenture, NVIDIA, AWS, Azure, and Google Cloud.",
    stat: "40+",
    tone: "dark",
  },
  {
    label: "Agents governed",
    body: "90% of enterprise teams expand after the first production rollout.",
    stat: "1.2K+",
    tone: "light",
  },
  {
    label: "POC-to-prod",
    body: "Governance first. Scale always. Conversion that actually ships.",
    stat: "95%",
    tone: "mid",
  },
] as const;

export function TrustSection() {
  const reduce = useReducedMotion();

  return (
    <section className="cine-facts" id="facts">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        viewport={{ once: true, amount: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        Key facts
      </motion.h2>
      <p className="cine-facts-sub">A snapshot of our experience and impact.</p>

      <div className="cine-facts-row">
        {CARDS.map((card, i) => (
          <motion.article
            className={`cine-fact-card is-${card.tone}`}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            key={card.label}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="cine-fact-label">{card.label}</p>
            <div className="cine-fact-body">
              <p>{card.body}</p>
              <strong>{card.stat}</strong>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
