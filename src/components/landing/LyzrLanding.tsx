'use client';

import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollProvider } from "./motion/SmoothScrollProvider";
import { SoundProvider } from "./motion/SoundProvider";
import { AgentCursor } from "./cinematic/AgentCursor";
import { CapabilitiesStack } from "./cinematic/CapabilitiesStack";
import { CinematicCta } from "./cinematic/CinematicCta";
import { CinematicHero } from "./cinematic/CinematicHero";
import { CinematicNav } from "./cinematic/CinematicNav";
import { CookieBar } from "./cinematic/CookieBar";
import { ManifestoSection } from "./cinematic/ManifestoSection";
import { MarqueeSection } from "./cinematic/MarqueeSection";
import { Preloader } from "./cinematic/Preloader";
import { ProofSection } from "./cinematic/ProofSection";
import { QuoteSection } from "./cinematic/QuoteSection";
import { TrustSection } from "./cinematic/TrustSection";

function LandingInner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const onDone = useCallback(() => {
    setBooted(true);
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (!booted) return;
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [booted]);

  return (
    <div className={`cine${booted ? " is-booted" : ""}`}>
      {!booted ? <Preloader onDone={onDone} /> : null}
      {booted ? <AgentCursor /> : null}
      <div aria-hidden className="cine-grain" />
      <CinematicNav
        onClose={() => setMenuOpen(false)}
        onToggle={() => setMenuOpen((v) => !v)}
        open={menuOpen}
      />
      <CookieBar />
      <main>
        <CinematicHero />
        <ManifestoSection />
        <MarqueeSection />
        <TrustSection />
        <ProofSection />
        <CapabilitiesStack />
        <QuoteSection />
        <CinematicCta />
      </main>
    </div>
  );
}

export default function LyzrLanding() {
  return (
    <SmoothScrollProvider>
      <SoundProvider>
        <LandingInner />
      </SoundProvider>
    </SmoothScrollProvider>
  );
}
