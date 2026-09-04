'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  onDone: () => void;
};

export function Preloader({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      const next = Math.min(100, Math.round(frame * 2.4));
      setProgress(next);
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setExit(true), 220);
        setTimeout(onDone, 780);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      aria-hidden
      className={`cine-preload${exit ? " is-exit" : ""}`}
    >
      <div className="cine-preload-mark">
        <span className="cine-crop tl" />
        <span className="cine-crop tr" />
        <span className="cine-crop bl" />
        <span className="cine-crop br" />
        <Image
          alt=""
          className="cine-preload-logo"
          height={88}
          src="/lyzr-mark.png"
          width={88}
          priority
        />
      </div>
      <p className="cine-preload-tag">Design · Build · Govern</p>
      <p className="cine-preload-pct">{progress}</p>
    </div>
  );
}
