'use client';

import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollProvider, useSmoothScroll } from "./motion/SmoothScrollProvider";
import { SoundProvider } from "./motion/SoundProvider";
import { AgentCursor } from "./cinematic/AgentCursor";
import { AwardsNewsSection } from "./cinematic/AwardsNewsSection";
import { CapabilitiesStack } from "./cinematic/CapabilitiesStack";
import { CeoMessageSection } from "./cinematic/CeoMessageSection";
import { CinematicCta } from "./cinematic/CinematicCta";
import { CinematicHero } from "./cinematic/CinematicHero";
import { LandingNav } from "./cinematic/LandingNav";
import { ManifestoSection } from "./cinematic/ManifestoSection";
import { MarqueeSection } from "./cinematic/MarqueeSection";
import { Preloader } from "./cinematic/Preloader";
import { ProofSection } from "./cinematic/ProofSection";
import { QuoteSection } from "./cinematic/QuoteSection";
import { TrustSection } from "./cinematic/TrustSection";

function LandingInner() {
  const { scrollTo } = useSmoothScroll();
  const [booted, setBooted] = useState(false);
  const onDone = useCallback(() => {
    setBooted(true);
    scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [scrollTo]);

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
      <LandingNav />
      <main>
        <CinematicHero />
        <ManifestoSection />
        <MarqueeSection />
        <TrustSection />
        <ProofSection />
        <CapabilitiesStack />
        <QuoteSection />
        <CeoMessageSection />
        <AwardsNewsSection />
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
