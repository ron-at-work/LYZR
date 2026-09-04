'use client';

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

function LineWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      el.style.setProperty("--mx", `${x}%`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden className="cine-line-word" ref={ref}>
      <span>LYZR</span>
    </div>
  );
}

export function CinematicCta() {
  const reduce = useReducedMotion();

  return (
    <section className="cine-close" id="contact">
      <div className="cine-close-top">
        <div>
          <p className="cine-close-kicker">Let&apos;s build work that inspires.</p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 24 }}
            transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true, amount: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Ready to build something bold?
          </motion.h2>
          <p className="cine-close-copy">©Lyzr {new Date().getFullYear()}</p>
          <p className="cine-close-hint">Sound on 🎵 Hover the lines.</p>
        </div>

        <div className="cine-close-actions">
          <a className="cine-link" href="https://www.lyzr.ai/book-demo/">
            Discuss your project <span aria-hidden>→</span>
          </a>
          <a className="cine-link" href="https://www.lyzr.ai/book-demo/">
            Book a 30-minute call <span aria-hidden>→</span>
          </a>

          <div className="cine-close-cols">
            <div>
              <p className="cine-label">Business enquiry</p>
              <a href="mailto:hello@lyzr.ai">hello@lyzr.ai</a>
            </div>
            <div>
              <p className="cine-label">Social</p>
              <a href="https://www.linkedin.com/company/lyzr-ai/">LinkedIn</a>
              <a href="https://x.com/lyzrai">X</a>
              <a href="https://www.lyzr.ai/blog/">Blog</a>
            </div>
          </div>
        </div>
      </div>

      <LineWordmark />
    </section>
  );
}

export function CinematicFooter() {
  return null;
}
