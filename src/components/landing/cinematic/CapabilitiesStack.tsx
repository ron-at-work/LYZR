"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";

const AgentForgeScene = dynamic(
  () => import("./AgentForgeScene").then((m) => m.AgentForgeScene),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    word: "Studio",
    caption: "A human opens Lyzr. Empty studio — desk, product, ready to build.",
    prompt: "Open Lyzr Studio…",
  },
  {
    word: "Architect",
    caption: "They sit down and design the agent inside Lyzr — role, tools, memory.",
    prompt: "Design support agent with CRM + memory…",
  },
  {
    word: "Deploy",
    caption: "The agent steps out of Lyzr into production — born from real use.",
    prompt: "Ship agent from Lyzr → VPC…",
  },
  {
    word: "Govern",
    caption: "Same human. Same platform. Agent stays governed on Lyzr.",
    prompt: "Bind identity + policy on Lyzr…",
  },
] as const;

const SERVICES = [
  {
    title: "Agent design",
    body: "Thoughtful agent design that captures attention, deepens engagement, and earns lasting trust.",
  },
  {
    title: "Control plane",
    body: "Impactful governance positions enterprises for success through clarity, audit, and lasting loyalty.",
  },
] as const;

export function CapabilitiesStack() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!pinRef.current || !ref.current) return;

    if (reduce) {
      progressRef.current = 1;
      setStage(STAGES.length - 1);
      return;
    }

    const onUpdate = (self: ScrollTrigger) => {
      progressRef.current = self.progress;
      const idx = Math.min(
        STAGES.length - 1,
        Math.floor(self.progress * STAGES.length * 0.999),
      );
      setStage((prev) => (prev === idx ? prev : idx));
    };

    const mm = gsap.matchMedia();

    mm.add("(max-width: 719px)", () => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=220%",
        pin: true,
        pinSpacing: true,
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate,
      });
    });

    mm.add("(min-width: 720px) and (max-width: 959px)", () => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=160%",
        pin: true,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate,
      });
    });

    mm.add("(min-width: 960px)", () => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=360%",
        pin: true,
        pinSpacing: true,
        scrub: 0.75,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate,
      });
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

  const active = STAGES[stage];

  return (
    <section className="cine-services" id="services" ref={ref}>
      <div className="cine-forge" ref={pinRef}>
        <div className="cine-forge-ui">
          <p className="cine-svc-label">Our platform</p>

          <div className="cine-forge-layout">
            <div className="cine-forge-copy">
              <h2 className="cine-forge-stage" key={active.word}>
                {active.word}
              </h2>
              <p className="cine-forge-caption" key={`${active.word}-c`}>
                {active.caption}
              </p>
              <ol className="cine-forge-rail" aria-label="Agent build stages">
                {STAGES.map((s, i) => (
                  <li
                    className={i === stage ? "is-active" : i < stage ? "is-done" : ""}
                    key={s.word}
                  >
                    <span>{s.word}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="cine-forge-frame">
              <div className="cine-forge-frame-top">
                <span>On Lyzr</span>
                <span>Human → Agent</span>
              </div>
              <div className="cine-forge-viewport">
                <AgentForgeScene className="cine-forge-canvas" progressRef={progressRef} />
              </div>
              <div
                className={`cine-forge-prompt${stage > 0 && stage < 3 ? " is-generating" : ""}${stage >= 3 ? " is-done" : ""}`}
                aria-hidden
              >
                <span className="cine-forge-prompt-text">{active.prompt}</span>
                <span className="cine-forge-prompt-btn">
                  {stage >= 3 ? "Online" : stage > 0 ? "Generating…" : "Generate"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="cine-svc-tag">Different disciplines. One standard of craft.</p>

      <div className="cine-svc-grid">
        {SERVICES.map((s) => (
          <article key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        ))}
      </div>

      <a className="cine-link cine-svc-link" href="#motion">
        View services <span aria-hidden>→</span>
      </a>
    </section>
  );
}
