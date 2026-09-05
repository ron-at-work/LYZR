'use client';

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollProvider, useSmoothScroll } from "./motion/SmoothScrollProvider";
import { SoundProvider } from "./motion/SoundProvider";
import { CinematicHero } from "./cinematic/CinematicHero";
import { LandingNav } from "./cinematic/LandingNav";
import { Preloader } from "./cinematic/Preloader";

const AgentCursor = dynamic(
  () => import("./cinematic/AgentCursor").then((m) => m.AgentCursor),
  { ssr: false },
);
const AwardsNewsSection = dynamic(() =>
  import("./cinematic/AwardsNewsSection").then((m) => m.AwardsNewsSection),
);
const CapabilitiesStack = dynamic(() =>
  import("./cinematic/CapabilitiesStack").then((m) => m.CapabilitiesStack),
);
const CeoMessageSection = dynamic(() =>
  import("./cinematic/CeoMessageSection").then((m) => m.CeoMessageSection),
);
const CinematicCta = dynamic(() =>
  import("./cinematic/CinematicCta").then((m) => m.CinematicCta),
);
const CompaniesSection = dynamic(() =>
  import("./cinematic/CompaniesSection").then((m) => m.CompaniesSection),
);
const ManifestoSection = dynamic(() =>
  import("./cinematic/ManifestoSection").then((m) => m.ManifestoSection),
);
const MarqueeSection = dynamic(() =>
  import("./cinematic/MarqueeSection").then((m) => m.MarqueeSection),
);
const ProofSection = dynamic(() =>
  import("./cinematic/ProofSection").then((m) => m.ProofSection),
);
const QuoteSection = dynamic(() =>
  import("./cinematic/QuoteSection").then((m) => m.QuoteSection),
);
const ReasonsSection = dynamic(() =>
  import("./cinematic/ReasonsSection").then((m) => m.ReasonsSection),
);
const TrustSection = dynamic(() =>
  import("./cinematic/TrustSection").then((m) => m.TrustSection),
);

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
        <CompaniesSection />
        <TrustSection />
        <ReasonsSection />
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
