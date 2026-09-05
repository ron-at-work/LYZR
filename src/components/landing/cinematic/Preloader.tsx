'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  onDone: () => void;
};

const LINES = [
  "Booting agent runtime",
  "Wiring tool calls",
  "Loading control plane",
  "Calibrating guardrails",
  "Agents standing by",
] as const;

const DURATION_MS = 900;

export function Preloader({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const onDoneRef = useRef(onDone);
  const finishedRef = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let raf = 0;
    let exitTimer = 0;
    let doneTimer = 0;
    let active = true;
    const started = performance.now();

    const finish = () => {
      if (finishedRef.current || !active) return;
      finishedRef.current = true;
      setProgress(100);
      setLineIdx(LINES.length - 1);
      exitTimer = window.setTimeout(() => {
        if (active) setExit(true);
      }, 280);
      doneTimer = window.setTimeout(() => {
        if (active) onDoneRef.current();
      }, 820);
    };

    const tick = (now: number) => {
      if (!active) return;
      const next = Math.min(100, Math.round(((now - started) / DURATION_MS) * 100));
      setProgress(next);
      setLineIdx(Math.min(LINES.length - 1, Math.floor(next / 22)));
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    raf = requestAnimationFrame(tick);

    // Interval fallback when rAF is throttled (background / embedded browsers)
    const watchdog = window.setInterval(() => {
      if (!active || finishedRef.current) return;
      const next = Math.min(100, Math.round(((performance.now() - started) / DURATION_MS) * 100));
      setProgress(next);
      setLineIdx(Math.min(LINES.length - 1, Math.floor(next / 22)));
      if (next >= 100) finish();
    }, 50);

    const hardCap = window.setTimeout(finish, DURATION_MS + 500);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      window.clearInterval(watchdog);
      window.clearTimeout(hardCap);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div aria-busy={!exit} aria-live="polite" className={`cine-preload${exit ? " is-exit" : ""}`}>
      <div className="cine-preload-mark">
        <svg aria-hidden className="cine-preload-track" viewBox="0 0 120 120">
          <rect className="cine-preload-track-base" height="118" rx="0" ry="0" width="118" x="1" y="1" />
          <rect className="cine-preload-track-run" height="118" rx="0" ry="0" width="118" x="1" y="1" />
        </svg>

        <span className="cine-crop tl" />
        <span className="cine-crop tr" />
        <span className="cine-crop bl" />
        <span className="cine-crop br" />

        <Image
          alt=""
          className="cine-preload-logo"
          height={88}
          priority
          src="/lyzr-mark-nav-dark.png"
          width={88}
        />
      </div>

      <p className="cine-preload-tag">
        <span className="cine-preload-loading">Loading</span>
        <span className="cine-preload-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </p>
      <p className="cine-preload-status" key={lineIdx}>
        {LINES[lineIdx]}
      </p>
      <p className="cine-preload-pct">{String(progress).padStart(3, "0")}</p>
    </div>
  );
}
