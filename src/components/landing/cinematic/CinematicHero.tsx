"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useSound } from "../motion/SoundProvider";
import { PhoneHeroVisual } from "./PhoneHeroVisual";

const HeroMark = dynamic(
  () => import("./HeroMark").then((m) => m.HeroMark),
  { ssr: false },
);
const InteractiveLines = dynamic(
  () => import("./InteractiveLines").then((m) => m.InteractiveLines),
  { ssr: false },
);

/** Rotating emphasis — Lyzr product outcomes, not agency filler. */
const WORDS = ["production.", "your VPC.", "enterprise.", "governance.", "scale."] as const;

/** Matches HeroMark buzz window before agent / AI-term emit. */
const BUZZ_MS = 550;
const HAPTIC_TICK_MS = 55;

export function CinematicHero() {
  const reduce = useReducedMotion();
  const { playHover, playPluck } = useSound();
  const [blast, setBlast] = useState(false);
  const [word, setWord] = useState(0);
  /** Phone: skip WebGL mark — typography-first hero. */
  const [showMark, setShowMark] = useState(false);
  /** Defer Three.js until idle so LCP/TBT aren't blocked by WebGL boot. */
  const [markReady, setMarkReady] = useState(false);
  const holdingRef = useRef(false);
  const timers = useRef<number[]>([]);
  const hapticRef = useRef(0);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 720px)");
    const sync = () => setShowMark(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!showMark) {
      setMarkReady(false);
      return;
    }
    let cancelled = false;
    const arm = () => {
      if (!cancelled) setMarkReady(true);
    };
    const ric = window.requestIdleCallback?.(arm, { timeout: 900 });
    const fallback = window.setTimeout(arm, 400);
    return () => {
      cancelled = true;
      if (ric != null) window.cancelIdleCallback?.(ric);
      window.clearTimeout(fallback);
    };
  }, [showMark]);

  const clearHoldTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (hapticRef.current) {
      window.clearInterval(hapticRef.current);
      hapticRef.current = 0;
    }
    try {
      navigator.vibrate?.(0);
    } catch {
      /* unsupported */
    }
  }, []);

  const releaseHold = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setBlast(false);
    clearHoldTimers();
  }, [clearHoldTimers]);

  const startHold = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!showMark || holdingRef.current) return;
      holdingRef.current = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      clearHoldTimers();
      setBlast(true);

      try {
        navigator.vibrate?.([12, 28, 14, 26, 16, 24, 18, 22, 20, 20, 22, 18]);
      } catch {
        /* unsupported */
      }
      if (!reduce) {
        hapticRef.current = window.setInterval(() => {
          if (!holdingRef.current) return;
          try {
            navigator.vibrate?.(22);
          } catch {
            /* unsupported */
          }
          playHover(0.85 + Math.random() * 0.45);
        }, HAPTIC_TICK_MS);
      }

      // When agents + AI terms emit (sound cue)
      const toExpand = window.setTimeout(
        () => {
          if (!holdingRef.current) return;
          if (hapticRef.current) {
            window.clearInterval(hapticRef.current);
            hapticRef.current = 0;
          }
          try {
            navigator.vibrate?.([8, 40, 30]);
          } catch {
            /* unsupported */
          }
          playPluck(220, 0.7);
        },
        reduce ? 40 : BUZZ_MS,
      );
      timers.current.push(toExpand);
    },
    [clearHoldTimers, playHover, playPluck, reduce, showMark],
  );

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setWord((w) => (w + 1) % WORDS.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduce]);

  useEffect(() => () => clearHoldTimers(), [clearHoldTimers]);

  const holdHandlers = {
    onPointerCancel: releaseHold,
    onPointerDown: startHold,
    onPointerUp: releaseHold,
  };

  return (
    <section className={`cine-hero${showMark ? "" : " is-phone"}`} id="top">
      {showMark && markReady ? <HeroMark blast={blast} className="cine-symbol-canvas" /> : null}
      {showMark && markReady ? <InteractiveLines blast={blast} /> : null}

      <div className="cine-hero-ui">
        <div className="cine-hero-left">
          <p className="cine-hero-kicker">Lyzr · Agent infrastructure</p>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            initial={false}
            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="cine-hero-line">Take AI agents to</span>
            <span className="cine-hero-swap" aria-live="polite">
              <AnimatePresence initial={false} mode="wait">
                <motion.em
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(8px)", y: -8 }}
                  initial={reduce ? false : { opacity: 0, filter: "blur(8px)", y: 10 }}
                  key={WORDS[word]}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                >
                  {WORDS[word]}
                </motion.em>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="cine-hero-lead"
            initial={false}
            transition={{ delay: 0.08, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            The enterprise platform to design, build, simulate, deploy, and govern a secure AI
            workforce — end to end.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="cine-cta-row"
            initial={false}
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

        {!showMark ? <PhoneHeroVisual /> : null}

        {showMark ? (
          <div className="cine-mark-stage">
            <div
              aria-label="Hold for agents and AI terms"
              className="cine-mark-hit"
              role="button"
              tabIndex={0}
              {...holdHandlers}
              onPointerLeave={releaseHold}
            />
          </div>
        ) : null}

        <button
          aria-label="Scroll to about"
          className="cine-scroll-hint"
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          type="button"
        >
          <span />
        </button>

        {showMark ? (
          <p className="cine-hold" {...holdHandlers} onPointerLeave={releaseHold}>
            Scroll to explore
            <br />
            Hold the mark — agents + AI terms
          </p>
        ) : null}

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
