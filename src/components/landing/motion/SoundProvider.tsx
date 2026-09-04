"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundApi = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  /** Soft hover tick — no-op while muted or reduced-motion. */
  playHover: (pitch?: number) => void;
};

const SoundContext = createContext<SoundApi>({
  muted: true,
  setMuted: () => {},
  toggleMuted: () => {},
  playHover: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

type AudioWin = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

/** Runtime Web Audio hover beeps (Trionn-style) — gated by the nav sound toggle. */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef(0);
  const reduceRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceRef.current = mq.matches;
    const onChange = () => {
      reduceRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || (window as AudioWin).webkitAudioContext;
    if (!AC) return null;
    ctxRef.current = new AC();
    return ctxRef.current;
  }, []);

  const playHover = useCallback(
    (pitch = 1) => {
      if (muted || reduceRef.current) return;
      const now = performance.now();
      if (now - lastRef.current < 55) return;
      lastRef.current = now;

      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();

      const t0 = ctx.currentTime;
      const freq = 520 * Math.max(0.55, Math.min(1.6, pitch));

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t0 + 0.09);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.045, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.13);
    },
    [ensureCtx, muted],
  );

  const toggleMuted = useCallback(() => {
    setMuted((v) => {
      const next = !v;
      if (!next) {
        const ctx = ensureCtx();
        if (ctx?.state === "suspended") void ctx.resume();
        // Confirm unmute with a soft tick
        window.setTimeout(() => {
          const c = ctxRef.current;
          if (!c) return;
          const t0 = c.currentTime;
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(660, t0);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.05, t0 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start(t0);
          osc.stop(t0 + 0.18);
        }, 0);
      }
      return next;
    });
  }, [ensureCtx]);

  const value = useMemo(
    () => ({ muted, setMuted, toggleMuted, playHover }),
    [muted, toggleMuted, playHover],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
