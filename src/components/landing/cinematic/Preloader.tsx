'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

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

export function Preloader({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      const next = Math.min(100, Math.round(frame * 1.85));
      setProgress(next);
      setLineIdx(Math.min(LINES.length - 1, Math.floor(next / 22)));
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setExit(true), 280);
        setTimeout(onDone, 820);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

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
