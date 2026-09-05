"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollApi = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollApi>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/** Lenis + ScrollTrigger wired like Trionn (pin-spacer / scrubbed WebGL). */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch + ScrollTrigger scrub stay in sync on iOS/Android
      syncTouch: true,
      syncTouchLerp: 0.12,
      touchMultiplier: 1.15,
    });

    lenisRef.current = instance;
    setLenis(instance);
    document.documentElement.classList.add("lenis");
    (window as unknown as { __lenis?: Lenis }).__lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.normalizeScroll(false);

    const ticker = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(ticker);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      lenis,
      stop: () => {
        lenisRef.current?.stop();
      },
      start: () => {
        lenisRef.current?.start();
      },
      scrollTo: (target, options) => {
        const instance = lenisRef.current;
        if (!instance) {
          if (typeof target === "string") {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
          } else if (typeof target === "number") {
            window.scrollTo({ top: target, behavior: "smooth" });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
          return;
        }
        instance.scrollTo(target, {
          offset: options?.offset ?? 0,
          immediate: options?.immediate ?? false,
        });
      },
    }),
    [lenis],
  );

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}
