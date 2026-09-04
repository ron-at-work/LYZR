'use client';

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#facts", label: "Key facts" },
  { href: "#work", label: "Work" },
  { href: "#services", label: "Platform" },
  { href: "#contact", label: "Contact" },
] as const;

type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function CinematicNav({ open, onToggle, onClose }: Props) {
  const reduce = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("is-nav-locked", open);
    return () => document.body.classList.remove("is-nav-locked");
  }, [open]);

  useEffect(() => {
    const darks = document.querySelectorAll(".cine-services, .cine-close");
    if (!darks.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const any = entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.35);
        setDark(any);
      },
      { threshold: [0.35, 0.5] },
    );
    darks.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className={`cine-nav${dark ? " is-dark" : ""}`}>
        <a className="cine-logo" href="#top" onClick={onClose}>
          <Image alt="Lyzr" height={28} src="/lyzr-mark.png" width={28} />
          <span>Lyzr</span>
        </a>
        <div className="cine-nav-actions">
          <button
            aria-label={muted ? "Unmute" : "Mute"}
            className="cine-sound"
            onClick={() => setMuted((v) => !v)}
            type="button"
          >
            <span className={muted ? "is-muted" : ""} />
          </button>
          <a className="cine-talk-pill" href="https://www.lyzr.ai/book-demo/">
            Get started
          </a>
          <button
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={`cine-menu-pill${open ? " is-open" : ""}`}
            onClick={onToggle}
            type="button"
          >
            Menu <span aria-hidden>=</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="cine-overlay"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="overlay"
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <nav aria-label="Primary">
              {LINKS.map((link, i) => (
                <motion.a
                  animate={{ opacity: 1, y: 0 }}
                  href={link.href}
                  initial={reduce ? false : { opacity: 0, y: 36 }}
                  key={link.href}
                  onClick={onClose}
                  transition={{
                    delay: reduce ? 0 : 0.08 + i * 0.06,
                    duration: 0.55,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
