"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NavMenuId } from "../data";
import { SiteHeader } from "../sections/SiteHeader";
import { useSound } from "../motion/SoundProvider";

const CLOSE_DELAY_MS = 160;

export function LandingNav() {
  const { muted, toggleMuted } = useSound();
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
    const onScroll = () => setNavSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-nav-locked", mobileOpen);
    return () => document.body.classList.remove("is-nav-locked");
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div className="landing-nav">
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
      <button
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        className="landing-nav-sound"
        onClick={toggleMuted}
        type="button"
      >
        <span className={muted ? "is-muted" : ""} />
      </button>
    </div>
  );
}
