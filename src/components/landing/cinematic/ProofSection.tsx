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
    image: "/landing/work-studio.jpg",
    index: "01",
  },
  {
    title: "Lyzr Architect",
    body: "Simulate behavior, cost, and failure modes before a single agent touches live traffic.",
    tag: "Prove before you prod",
    href: "https://www.lyzr.ai/",
    image: "/landing/work-architect.jpg",
    index: "02",
  },
  {
    title: "Control Plane",
    body: "Govern any framework, any model, any cloud. Policy, observability, and audit in one plane.",
    tag: "Govern at enterprise scale",
    href: "https://www.lyzr.ai/",
    image: "/landing/work-control.jpg",
    index: "03",
  },
] as const;

/** Three projects always visible — hover/focus swaps the featured frame. */
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
    const frame = section.querySelector<HTMLElement>(".cine-work-frame");

    const ctx = gsap.context(() => {
      gsap.set([head, frame], { opacity: 0, y: 28 });
      gsap.set(items, { opacity: 0, y: 36 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(head, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
        .to(frame, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.3")
        .to(
          items,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.35",
        );
    }, ref);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [reduce]);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  const featured = PROJECTS[active];

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
          <div className="cine-work-frame" aria-hidden>
            {PROJECTS.map((p, i) => (
              <div
                className={`cine-work-panel${i === active ? " is-active" : ""}`}
                key={p.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={p.image} />
              </div>
            ))}
            <div className="cine-work-frame-meta">
              <span>{featured.index}</span>
              <span>{featured.title}</span>
            </div>
          </div>

          <ul className="cine-work-list" role="list">
            {PROJECTS.map((p, i) => (
              <li key={p.title}>
                <div
                  className={`cine-work-item${i === active ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocusCapture={() => setActive(i)}
                >
                  <button
                    type="button"
                    className="cine-work-hit"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    aria-label={`Show ${p.title}`}
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
