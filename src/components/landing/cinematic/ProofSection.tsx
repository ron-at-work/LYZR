"use client";

import { motion, useReducedMotion } from "motion/react";

const PROJECTS = [
  {
    title: "Lyzr Studio",
    body: "Compose multi-agent workflows with the speed of a prototype and the discipline of production.",
    tag: "Build agents that ship",
    href: "https://www.lyzr.ai/",
    tone: "is-a",
  },
  {
    title: "Lyzr Architect",
    body: "Simulate behavior, cost, and failure modes before a single agent touches live traffic.",
    tag: "Prove before you prod",
    href: "https://www.lyzr.ai/",
    tone: "is-b",
  },
  {
    title: "Control Plane",
    body: "Govern any framework, any model, any cloud. Policy, observability, and audit in one plane.",
    tag: "Govern at enterprise scale",
    href: "https://www.lyzr.ai/",
    tone: "is-c",
  },
] as const;

/** Work grid — float/converge lives on the hero now. */
export function ProofSection() {
  const reduce = useReducedMotion();

  return (
    <section className="cine-work" id="work">
      <div className="cine-work-body">
        <div className="cine-work-intro">
          <p className="cine-label">Selected work</p>
          <h2>Our work</h2>
          <a className="cine-link" href="https://www.lyzr.ai/">
            View all projects <span aria-hidden>→</span>
          </a>
        </div>

        <div className="cine-work-list">
          {PROJECTS.map((p, i) => (
            <motion.article
              className="cine-work-card"
              initial={reduce ? false : { opacity: 0, y: 36 }}
              key={p.title}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              viewport={{ once: true, amount: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className={`cine-work-visual ${p.tone}`}>
                <span>{p.tag}</span>
                <strong>{p.title}</strong>
              </div>
              <div className="cine-work-meta">
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
                <a className="cine-link" href={p.href}>
                  Explore project <span aria-hidden>→</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="cine-work-bridge">
          <p>Discover our complete collection of digital experiences, brands, and platforms.</p>
          <a className="cine-link" href="#services">
            View services <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
