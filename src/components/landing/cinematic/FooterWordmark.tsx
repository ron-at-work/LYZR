"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { useSound } from "../motion/SoundProvider";

/** Soft flute-friendly pentatonic (Hz) — Trionn footer string scale. */
const SCALE = [196, 220, 246.94, 293.66, 329.63, 392, 440, 493.88] as const;
const LINE_COUNT = 20;

type WaveState = { amp: number; phase: number; speed: number };

/**
 * Striped “LYZR” wordmark with pluckable horizontal strings (Trionn footer).
 * Visual = CSS clipped type; interaction = hit strips + Web Audio flute pluck.
 */
export function FooterWordmark() {
  const { playPluck } = useSound();
  const playPluckRef = useRef(playPluck);
  playPluckRef.current = playPluck;

  const faceRef = useRef<HTMLSpanElement>(null);
  const waves = useRef<WaveState[]>(
    Array.from({ length: LINE_COUNT }, () => ({ amp: 0, phase: 0, speed: 0 })),
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const face = faceRef.current;
    if (!face) return;

    let raf = 0;
    let last = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      let maxAmp = 0;
      let hotY = 0.5;
      for (let i = 0; i < LINE_COUNT; i++) {
        const st = waves.current[i]!;
        if (st.amp > 0.02 || st.speed > 0.02) {
          st.phase += st.speed * dt;
          if (st.amp > maxAmp) {
            maxAmp = st.amp;
            hotY = (i + 0.5) / LINE_COUNT;
          }
        } else if (st.amp !== 0) {
          st.amp = 0;
          st.speed = 0;
        }
      }
      const wobble = maxAmp > 0.05 ? Math.sin(performance.now() / 55) * maxAmp * 0.35 : 0;
      face.style.setProperty("--wave", `${wobble.toFixed(2)}px`);
      face.style.setProperty("--hot-y", `${(hotY * 100).toFixed(1)}%`);
      face.style.setProperty("--hot-a", maxAmp > 0.05 ? "1" : "0");
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pluck = useCallback((index: number) => {
    const st = waves.current[index];
    if (!st) return;
    gsap.killTweensOf(st);
    st.amp = 10;
    st.speed = 18;
    gsap.to(st, { amp: 0, duration: 0.95, ease: "expo.out" });
    gsap.to(st, { speed: 0, duration: 0.95, ease: "expo.out" });
    const note = SCALE[index % SCALE.length]! * (index % 2 ? 1 : 0.5);
    const intensity = Math.pow(index / (LINE_COUNT - 1), 1.15);
    playPluckRef.current(note, intensity);
  }, []);

  return (
    <div className="cine-line-word font-display">
      <div aria-hidden className="cine-line-word-stage">
        <span className="cine-line-word-face" ref={faceRef}>
          LYZR
        </span>
        <div className="cine-line-word-hits">
          {Array.from({ length: LINE_COUNT }, (_, i) => (
            <button
              aria-label={`Pluck string ${i + 1}`}
              className="cine-line-word-hit"
              key={i}
              onClick={() => pluck(i)}
              onPointerEnter={() => pluck(i)}
              type="button"
            />
          ))}
        </div>
      </div>
      <span className="sr-only">LYZR</span>
    </div>
  );
}
