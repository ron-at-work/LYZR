"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";
import { useSound } from "../motion/SoundProvider";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    index: "01",
    title: "Architect",
    headline: "Build any agent, no code needed.",
    body: "Describe what you need in plain language. Architect builds the full agent: logic, integrations, access controls, and UI, ready to use from day one.",
    points: [
      "Conversation to application in one pass",
      "Connects ERP, CRM, HRIS, and documents",
      "RBAC, audit logging, and compliance built in",
    ],
    callout: "No code needed. From idea to working agent.",
  },
  {
    index: "02",
    title: "Platform + People",
    headline: "Live in weeks, not quarters.",
    body: "Lyzr engineers embed with your team. They handle governance, integrations, and compliance sign-off, and stay until your agents are running in production.",
    points: [
      "Forward-deployed engineers, end to end",
      "Eight-week average to production",
      "Compliance handled alongside your team",
    ],
    callout: "85% of Lyzr projects reach production.",
  },
  {
    index: "03",
    title: "Pre-built Agents",
    headline: "Start from what already works.",
    body: "200+ agents already proven in environments like yours across BFSI, healthcare, HR, and operations. Customize for your context. Deploy in days, not months.",
    points: [
      "Production-tested across industries",
      "Customizable to your data and tools",
      "Validated in simulation before delivery",
    ],
    callout: "1,000+ agents live across 500+ enterprises.",
  },
  {
    index: "04",
    title: "Simulation + Improvement",
    headline: "Catch failures before customers do.",
    body: "Every agent runs through thousands of real-world scenarios before going live. Once live, it monitors itself and improves automatically.",
    points: [
      "Thousands of scenarios before deployment",
      "Domain suites for BFSI, healthcare, and HR",
      "Self-improving from production logs",
    ],
    callout: "Simulation is why 85% of projects ship.",
  },
  {
    index: "05",
    title: "No Lock-in",
    headline: "Your agents, your IP, always.",
    body: "Everything you build lives in your environment, on open protocols, under your control. If you ever move, it all moves with you. No exit penalty.",
    points: [
      "Open-source orchestration, no migration tax",
      "Deployed inside your own VPC",
      "You own every agent you build",
    ],
    callout: "Your environment. Your control. Your IP.",
  },
] as const;

export function ReasonsSection() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const { playHover } = useSound();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!ref.current || reduce) return;
    const section = ref.current;
    const head = section.querySelector<HTMLElement>(".cine-reasons-head");
    const rail = section.querySelectorAll<HTMLElement>(".cine-reasons-rail-item");
    const panel = section.querySelector<HTMLElement>(".cine-reasons-panel");

    const mm = gsap.matchMedia();

    mm.add("(max-width: 719px)", () => {
      gsap.set([head, panel], { opacity: 1, y: 0 });
      gsap.set(rail, { opacity: 1, x: 0 });

      const pinTarget =
        section.querySelector<HTMLElement>(".cine-reasons-stage") ?? section;

      ScrollTrigger.create({
        trigger: pinTarget,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * Math.max(2.4, REASONS.length * 0.55))}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.45,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const idx = Math.min(
            REASONS.length - 1,
            Math.floor(self.progress * REASONS.length * 0.999),
          );
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
    });

    mm.add("(min-width: 720px)", () => {
      gsap.set([head, panel], { opacity: 0, y: 28 });
      gsap.set(rail, { opacity: 0, x: -18 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(head, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
        .to(
          rail,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
          },
          "-=0.28",
        )
        .to(panel, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.35");
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
    if (!panelRef.current || reduce) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0.35, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );
  }, [active, reduce]);

  const reason = REASONS[active];

  return (
    <section className="cine-reasons" id="reasons" ref={ref}>
      <div className="cine-reasons-stage">
        <div className="cine-reasons-head">
          <h2>Five reasons enterprises pick Lyzr.</h2>
          <p>
            Platform and people that get agents across the POC-to-production line.
          </p>
        </div>

        <div className="cine-reasons-board">
          <div className="cine-reasons-rail" role="tablist" aria-label="Enterprise reasons">
            {REASONS.map((item, i) => (
              <button
                type="button"
                role="tab"
                key={item.index}
                id={`reason-tab-${item.index}`}
                aria-selected={i === active}
                aria-controls="reason-panel"
                tabIndex={i === active ? 0 : -1}
                className={`cine-reasons-rail-item${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => {
                  setActive(i);
                  playHover(0.7 + i * 0.08);
                }}
                onFocus={() => {
                  setActive(i);
                  playHover(0.7 + i * 0.08);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
                    return;
                  }
                  e.preventDefault();
                  let next = i;
                  if (e.key === "ArrowDown") next = (i + 1) % REASONS.length;
                  if (e.key === "ArrowUp") next = (i - 1 + REASONS.length) % REASONS.length;
                  if (e.key === "Home") next = 0;
                  if (e.key === "End") next = REASONS.length - 1;
                  setActive(next);
                  playHover(0.7 + next * 0.08);
                  requestAnimationFrame(() => {
                    document.getElementById(`reason-tab-${REASONS[next].index}`)?.focus();
                  });
                }}
              >
                <span className="cine-reasons-rail-num">{item.index}</span>
                <span className="cine-reasons-rail-title">{item.title}</span>
              </button>
            ))}
          </div>

          <div
            className="cine-reasons-panel"
            id="reason-panel"
            role="tabpanel"
            aria-labelledby={`reason-tab-${reason.index}`}
            ref={panelRef}
          >
            <p className="cine-reasons-panel-index">{reason.index}</p>
            <h3>{reason.headline}</h3>
            <p className="cine-reasons-panel-body">{reason.body}</p>
            <ul className="cine-reasons-points">
              {reason.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="cine-reasons-callout">{reason.callout}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
