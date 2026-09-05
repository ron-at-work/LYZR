"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: "Lyzr Studio",
    body: "Compose multi-agent workflows with the speed of a prototype and the discipline of production.",
    tag: "Build agents that ship",
    href: "https://www.lyzr.ai/",
    image: "/landing/work-studio.webp",
    index: "01",
  },
  {
    title: "Lyzr Architect",
    body: "Simulate behavior, cost, and failure modes before a single agent touches live traffic.",
    tag: "Prove before you prod",
    href: "https://www.lyzr.ai/",
    image: "/landing/work-architect.webp",
    index: "02",
  },
  {
    title: "Control Plane",
    body: "Govern any framework, any model, any cloud. Policy, observability, and audit in one plane.",
    tag: "Govern at enterprise scale",
    href: "https://www.lyzr.ai/",
    image: "/landing/work-control.webp",
    index: "03",
  },
] as const;

/** Accordion list — click a project to reveal its image directly underneath. */
export function ProofSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!ref.current || reduce) return;
    const section = ref.current;
    const head = section.querySelector<HTMLElement>(".cine-work-intro");
    const items = section.querySelectorAll<HTMLElement>(".cine-work-item");
    const board = section.querySelector<HTMLElement>(".cine-work-board");

    const mm = gsap.matchMedia();

    mm.add("(max-width: 719px)", () => {
      gsap.set(head, { opacity: 1, y: 0 });
      gsap.set(items, { opacity: 0.25, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: board ?? section,
          start: "top top+=56",
          end: "+=160%",
          pin: true,
          pinSpacing: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const idx = Math.min(
              PROJECTS.length - 1,
              Math.floor(self.progress * PROJECTS.length * 0.999),
            );
            setActive((prev) => (prev === idx ? prev : idx));
          },
        },
      });

      tl.to(items, {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: { each: 0.15, from: "start" },
      });
    });

    mm.add("(min-width: 720px)", () => {
      gsap.set(head, { opacity: 0, y: 28 });
      gsap.set(items, { opacity: 0, y: 36 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(head, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }).to(
        items,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.25",
      );
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [reduce]);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 420);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <section className="cine-work" id="work" ref={ref}>
      <div className="cine-work-stage">
        <div className="cine-work-intro">
          <p className="cine-label">Selected work</p>
          <h2>Our work</h2>
          <a className="cine-link" href="https://www.lyzr.ai/">
            View all projects <span aria-hidden>→</span>
          </a>
        </div>

        <div className="cine-work-board">
          <ul className="cine-work-list" role="list">
            {PROJECTS.map((p, i) => {
              const isOpen = i === active;
              return (
                <li key={p.title}>
                  <div className={`cine-work-item${isOpen ? " is-active" : ""}`}>
                    <div className="cine-work-row">
                      <button
                        type="button"
                        className="cine-work-hit"
                        onClick={() => setActive(i)}
                        aria-expanded={isOpen}
                        aria-controls={`work-panel-${p.index}`}
                        aria-label={`${isOpen ? "Showing" : "Show"} ${p.title}`}
                      >
                        <span className="cine-work-num">{p.index}</span>
                        <span className="cine-work-copy">
                          <span className="cine-work-tag">{p.tag}</span>
                          <span className="cine-work-title">{p.title}</span>
                          <span className="cine-work-body">{p.body}</span>
                        </span>
                      </button>
                      <a className="cine-link cine-work-cta" href={p.href}>
                        Explore <span aria-hidden>→</span>
                      </a>
                    </div>

                    <div
                      className={`cine-work-reveal${isOpen ? " is-open" : ""}`}
                      id={`work-panel-${p.index}`}
                      role="region"
                      aria-hidden={!isOpen}
                    >
                      <div className="cine-work-reveal-inner">
                        <div className="cine-work-frame">
                          {isOpen || i === active ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt=""
                              decoding="async"
                              height={933}
                              loading={i === 0 ? "eager" : "lazy"}
                              sizes="(max-width: 960px) 92vw, 1100px"
                              src={p.image}
                              width={1400}
                            />
                          ) : null}
                          <div className="cine-work-frame-meta">
                            <span>{p.index}</span>
                            <span>{p.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
