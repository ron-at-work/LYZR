"use client";

/**
 * Phone-only hero — official Lyzr mark, grainy + speed streaks.
 * Desktop keeps WebGL HeroMark.
 */
export function PhoneHeroVisual() {
  return (
    <figure className="cine-phone-visual" aria-hidden>
      <div className="cine-phone-visual-glow" />
      <div className="cine-phone-visual-speed" />
      <img
        alt=""
        className="cine-phone-visual-img"
        decoding="async"
        draggable={false}
        height={1100}
        src="/lyzr-phone-hero-mark.jpg"
        width={1100}
      />
      <span className="cine-phone-visual-grain" />
    </figure>
  );
}
