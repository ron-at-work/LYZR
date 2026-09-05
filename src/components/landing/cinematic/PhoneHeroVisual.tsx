"use client";

/**
 * Phone-only hero — black ball drops, runs, morphs into Lyzr mark (~11s loop).
 * Desktop keeps WebGL HeroMark.
 */
export function PhoneHeroVisual() {
  return (
    <figure className="cine-phone-visual" aria-hidden>
      <picture>
        <source srcSet="/lyzr-phone-hero-run.webp" type="image/webp" />
        <img
          alt=""
          className="cine-phone-visual-img"
          decoding="async"
          draggable={false}
          height={420}
          src="/lyzr-phone-hero-run.gif"
          width={420}
        />
      </picture>
    </figure>
  );
}
