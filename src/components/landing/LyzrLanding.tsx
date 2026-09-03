'use client';

import { useEffect, useRef, useState } from "react";
import AgentStack from "../AgentStack";
import TrustSection from "../TrustSection";
import type { NavMenuId } from "./data";
import {
  AdlcSection,
  CaseStudiesSection,
  ControlPlaneSection,
  CtaSection,
  EngagementPathsSection,
  FounderSection,
  HeroSection,
  KnowledgeSection,
  LogoGridSection,
  OperatingModelsSection,
  ProductionizationGap,
  SiteFooter,
  SiteHeader,
  TestimonialsSection,
  WhyLyzrSection,
  WorkforceSection,
} from "./sections";

export default function LyzrLanding() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const [isDev, setIsDev] = useState(false);
  const [agentCount, setAgentCount] = useState(1240);
  const [navSolid, setNavSolid] = useState(false);
  const [openNav, setOpenNav] = useState<NavMenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<NavMenuId | null>(null);
  const navCloseTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const closeMobileNav = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  const toggleMobileSection = (id: NavMenuId) => {
    setMobileSection((prev) => (prev === id ? null : id));
  };

  const openNavMenu = (id: NavMenuId) => {
    if (navCloseTimer.current != null) {
      window.clearTimeout(navCloseTimer.current);
      navCloseTimer.current = null;
    }
    setOpenNav(id);
  };

  const scheduleCloseNav = () => {
    if (navCloseTimer.current != null) window.clearTimeout(navCloseTimer.current);
    navCloseTimer.current = window.setTimeout(() => setOpenNav(null), 140);
  };

  useEffect(() => {
    return () => {
      if (navCloseTimer.current != null) window.clearTimeout(navCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const next = window.scrollY > 72;
      setNavSolid((prev) => (prev === next ? prev : next));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const syncHeroOffset = () => {
      const header = headerRef.current;
      if (!header) return;
      const h = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--hero-offset", `${h + 16}px`);
    };
    syncHeroOffset();
    window.addEventListener("resize", syncHeroOffset);
    return () => window.removeEventListener("resize", syncHeroOffset);
  }, [bannerOpen, mobileOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) closeMobileNav();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-nav-locked", mobileOpen);
    return () => document.body.classList.remove("is-nav-locked");
  }, [mobileOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    let targetX = 0.5;
    let targetY = 0.28;
    let currentX = targetX;
    let currentY = targetY;

    const onMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetX = (event.clientX - rect.left) / rect.width;
      targetY = (event.clientY - rect.top) / rect.height;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      hero.style.setProperty("--spot-x", `${(currentX * 100).toFixed(3)}%`);
      hero.style.setProperty("--spot-y", `${(currentY * 100).toFixed(3)}%`);
      frame = requestAnimationFrame(tick);
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const target = 1287;
    const start = 1240;
    const duration = 1800;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAgentCount(Math.round(start + (target - start) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const drift = window.setInterval(() => {
      setAgentCount((n) => n + (Math.random() > 0.55 ? 1 : 0));
    }, 2200);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(drift);
    };
  }, []);

  return (
    <div className="bg-surface-canvas font-sans text-text-primary antialiased selection:bg-primary selection:text-on-primary">
      <SiteHeader
        bannerOpen={bannerOpen}
        closeMobileNav={closeMobileNav}
        headerRef={headerRef}
        mobileOpen={mobileOpen}
        mobileSection={mobileSection}
        navSolid={navSolid}
        onDismissBanner={() => setBannerOpen(false)}
        openNav={openNav}
        openNavMenu={openNavMenu}
        scheduleCloseNav={scheduleCloseNav}
        setMobileOpen={setMobileOpen}
        toggleMobileSection={toggleMobileSection}
      />

      <main className="w-full">
        <HeroSection agentCount={agentCount} heroRef={heroRef} isDev={isDev} setIsDev={setIsDev} />
        <LogoGridSection />
        <ControlPlaneSection />
       
        <WhyLyzrSection />
        <AgentStack />
        <AdlcSection />
        <OperatingModelsSection />
        <ProductionizationGap />
        <TestimonialsSection />
        <WorkforceSection />
        <CaseStudiesSection />

        <FounderSection />
      
        <EngagementPathsSection />
        <KnowledgeSection />
        <TrustSection />

        <CtaSection />
      </main>

      <SiteFooter />
    </div>
  );
}
