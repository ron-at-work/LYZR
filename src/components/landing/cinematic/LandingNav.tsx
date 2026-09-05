"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NavMenuId } from "../data";
import { SiteHeader } from "../sections/SiteHeader";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

const CLOSE_DELAY_MS = 160;

export function LandingNav() {
  const { lenis, stop, start } = useSmoothScroll();
  const headerRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [bannerOpen, setBannerOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [openNav, setOpenNav] = useState<NavMenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<NavMenuId | null>(null);

  const openNavMenu = useCallback((id: NavMenuId) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenNav(id);
  }, []);

  const scheduleCloseNav = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenNav(null), CLOSE_DELAY_MS);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, []);

  const toggleMobileSection = useCallback((id: NavMenuId) => {
    setMobileSection((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = lenis?.scroll ?? window.scrollY;
      setNavSolid(y > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    lenis?.on("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis?.off("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    document.body.classList.toggle("is-nav-locked", mobileOpen);
    document.documentElement.classList.toggle("is-nav-locked", mobileOpen);

    if (mobileOpen) stop();
    else start();

    return () => {
      document.body.classList.remove("is-nav-locked");
      document.documentElement.classList.remove("is-nav-locked");
      start();
    };
  }, [mobileOpen, stop, start]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobileNav]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div className={`landing-nav${navSolid ? " is-scrolled" : ""}`}>
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
    </div>
  );
}
