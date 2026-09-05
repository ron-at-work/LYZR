"use client";

/**
 * Phone-only hero — black ball drops, runs, morphs into Lyzr mark (~11s loop).
 * Desktop keeps WebGL HeroMark.
 */
export function PhoneHeroVisual() {
  return (
    <figure className="cine-phone-visual" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="cine-phone-visual-img"
        decoding="async"
        draggable={false}
        fetchPriority="high"
        height={360}
        loading="eager"
        src="/lyzr-phone-hero-run.webp"
        width={360}
      />
    </figure>
  );
}
