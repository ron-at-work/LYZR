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
  /** Footer string pluck — flute-like layered sine (Trionn-style). */
  playPluck: (freq: number, intensity?: number) => void;
};

const SoundContext = createContext<SoundApi>({
  muted: true,
  setMuted: () => {},
  toggleMuted: () => {},
  playHover: () => {},
  playPluck: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

type AudioWin = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

/** Runtime Web Audio (Trionn-style) — gated by the nav sound toggle. */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef(0);
  const lastPluckRef = useRef(0);
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

  const playPluck = useCallback(
    (freq: number, intensity = 0.45) => {
      if (muted || reduceRef.current) return;
      const nowMs = performance.now();
      if (nowMs - lastPluckRef.current < 40) return;
      lastPluckRef.current = nowMs;

      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();

      const now = ctx.currentTime;
      const i = Math.max(0, Math.min(1, intensity));
      const f = Math.max(80, Math.min(1400, freq));

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.07 + i * 0.05, now + 0.018);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.65);
      master.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "sine";
      osc3.type = "sine";
      osc1.frequency.setValueAtTime(f, now);
      osc2.frequency.setValueAtTime(f * 2.002, now);
      osc3.frequency.setValueAtTime(f * 3.01, now);

      const g1 = ctx.createGain();
      const g2 = ctx.createGain();
      const g3 = ctx.createGain();
      g1.gain.setValueAtTime(0.55, now);
      g2.gain.setValueAtTime(0.22, now);
      g3.gain.setValueAtTime(0.1, now);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(4.9, now);
      lfoGain.gain.setValueAtTime(3.2 + i * 2.4, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      const delay = ctx.createDelay(1);
      delay.delayTime.setValueAtTime(0.14, now);
      const echoLP = ctx.createBiquadFilter();
      echoLP.type = "lowpass";
      echoLP.frequency.setValueAtTime(1800, now);
      const fb = ctx.createGain();
      fb.gain.setValueAtTime(0.0001, now);
      fb.gain.linearRampToValueAtTime(0.28 + i * 0.14, now + 0.05);

      const dry = ctx.createGain();
      dry.gain.setValueAtTime(0.85, now);

      osc1.connect(g1);
      osc2.connect(g2);
      osc3.connect(g3);
      g1.connect(dry);
      g2.connect(dry);
      g3.connect(dry);
      dry.connect(master);
      dry.connect(delay);
      delay.connect(echoLP);
      echoLP.connect(fb);
      fb.connect(delay);
      echoLP.connect(master);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      lfo.start(now);
      osc1.stop(now + 1.7);
      osc2.stop(now + 1.7);
      osc3.stop(now + 1.7);
      lfo.stop(now + 1.7);
    },
    [ensureCtx, muted],
  );

  const toggleMuted = useCallback(() => {
    setMuted((v) => {
      const next = !v;
      if (!next) {
        const ctx = ensureCtx();
        if (ctx?.state === "suspended") void ctx.resume();
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
    () => ({ muted, setMuted, toggleMuted, playHover, playPluck }),
    [muted, toggleMuted, playHover, playPluck],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
