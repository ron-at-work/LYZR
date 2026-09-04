"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { WORKFORCE_AGENTS, type WorkforceAgentId } from "../data";
import {
  preloadAgentVoices,
  speakAgentVoice,
  stopAgentVoice,
  type AgentVoiceHandle,
} from "../motion/agentVoice";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";
import { useSound } from "../motion/SoundProvider";

gsap.registerPlugin(ScrollTrigger);

const TONES = ["a", "b", "c", "d", "e", "f"] as const;

const CHAR_LINES: Record<
  WorkforceAgentId,
  { codename: string; role: string; lines: readonly [string, string, string] }
> = {
  jeff: {
    codename: "FRONTLINE",
    role: "Support Class · Voice Ready",
    lines: [
      "Answers every channel before a ticket ages out.",
      "Refunds, status, escalation — tools with a leash.",
      "The calm voice customers hear at 2 a.m.",
    ],
  },
  jazon: {
    codename: "PIPELINE",
    role: "Revenue Class · Outbound Voice",
    lines: [
      "Hunts buying signals before your SDR wakes up.",
      "Sequences that sound human. Meetings that stick.",
      "CRM is home base. Pipeline is the scoreboard.",
    ],
  },
  diane: {
    codename: "PEOPLE",
    role: "Talent Class · Always On",
    lines: [
      "Onboarding, policy, leave — zero backlog energy.",
      "Workday and Slack are her native terrain.",
      "The teammate HR wished they could clone.",
    ],
  },
  skott: {
    codename: "SIGNAL",
    role: "Marketing Class · Brand Locked",
    lines: [
      "Turns knowledge bases into campaigns overnight.",
      "SEO, case studies, social — one voice throughout.",
      "Cadence is the weapon. Consistency is the armor.",
    ],
  },
  dwight: {
    codename: "TENDER",
    role: "Ops Class · Citation First",
    lines: [
      "Reads hundred-page RFPs like a morning brief.",
      "Compliance answers with receipts, not vibes.",
      "Bids assemble while the war room argues scope.",
    ],
  },
  kathy: {
    codename: "SCOUT",
    role: "Intel Class · 24/7 Watch",
    lines: [
      "Filings, pricing, jobs — nothing slips the net.",
      "Daily briefings ready before the standup starts.",
      "Your early warning system with an executive tone.",
    ],
  },
};

export function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<AgentVoiceHandle | null>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const { playHover } = useSound();
  const [playingId, setPlayingId] = useState<WorkforceAgentId | null>(null);
  const [focusId, setFocusId] = useState<WorkforceAgentId | null>(null);

  const active = WORKFORCE_AGENTS.find((a) => a.id === (playingId ?? focusId)) ?? null;
  const char = active ? CHAR_LINES[active.id] : null;
  const isSpeaking = playingId !== null;

  useEffect(() => {
    preloadAgentVoices();
    return () => {
      handleRef.current?.stop();
      handleRef.current = null;
      stopAgentVoice();
    };
  }, []);

  useEffect(() => {
    if (!charRef.current || !active || reduce) return;
    const el = charRef.current;
    gsap.fromTo(
      el.querySelectorAll(".cine-char-anim"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" },
    );
  }, [active?.id, reduce]);

  const playAgentVoice = useCallback(
    (id: WorkforceAgentId) => {
      const agent = WORKFORCE_AGENTS.find((a) => a.id === id);
      if (!agent) return;

      if (playingId === id) {
        handleRef.current?.stop();
        handleRef.current = null;
        stopAgentVoice();
        setPlayingId(null);
        return;
      }

      handleRef.current?.stop();
      handleRef.current = null;
      stopAgentVoice();

      setFocusId(id);
      setPlayingId(id);

      handleRef.current = speakAgentVoice({
        text: agent.voiceScript,
        onEnd: () => {
          setPlayingId((cur) => (cur === id ? null : cur));
          handleRef.current = null;
        },
      });
    },
    [playingId],
  );

  useEffect(() => {
    if (!ref.current) return;
    const section = ref.current;
    const head = section.querySelector<HTMLElement>(".cine-motion-head");
    const tiles = section.querySelectorAll<HTMLElement>(".cine-motion-tile");
    const foot = section.querySelector<HTMLElement>(".cine-motion-foot");
    const stage = section.querySelector<HTMLElement>(".cine-motion-stage");

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([head, tiles, foot, stage], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set(head, { opacity: 0, y: 28 });
      gsap.set(tiles, { opacity: 0, y: 72, rotateX: 8, transformOrigin: "50% 100%" });
      gsap.set(foot, { opacity: 0, y: 20 });
      gsap.set(stage, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(head, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" })
        .to(stage, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.08)
        .to(
          tiles,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.12,
        )
        .to(foot, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.35");
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

  return (
    <section className="cine-motion" id="motion" ref={ref}>
      <div className="cine-motion-head">
        <h2>
          <span>Agents &amp;</span>
          <span>voices</span>
        </h2>
        <p className="cine-motion-center">
          Pick a character. Hit play. Hear them speak.
        </p>
      </div>

      <div className={`cine-motion-stage${active ? " has-char" : ""}`}>
        <div className="cine-motion-roster" role="list">
          {WORKFORCE_AGENTS.map((agent, i) => {
            const tone = TONES[i % TONES.length];
            const isLive = playingId === agent.id;
            const isFocus = focusId === agent.id;
            return (
              <article
                className={`cine-motion-tile cine-agent-tile is-${tone}${isLive ? " is-live" : ""}${isFocus ? " is-focus" : ""}`}
                key={agent.id}
                onFocus={() => {
                  playHover(0.85 + (i % 6) * 0.08);
                  setFocusId(agent.id);
                }}
                onMouseEnter={() => {
                  playHover(0.85 + (i % 6) * 0.08);
                  if (!playingId) setFocusId(agent.id);
                }}
                role="listitem"
              >
                <div className="cine-agent-media" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src={agent.image} decoding="async" loading="lazy" />
                </div>

                <div className="cine-agent-top">
                  <span className="cine-agent-dept">{agent.dept}</span>
                  {agent.voice ? (
                    <span className={`cine-agent-badge${isLive ? " is-on" : ""}`}>
                      <span className="cine-agent-dot" aria-hidden />
                      {isLive ? "Live" : "Voice"}
                    </span>
                  ) : (
                    <span className="cine-agent-badge is-quiet">Text</span>
                  )}
                </div>

                <div className="cine-agent-body">
                  <p className="cine-agent-name">{agent.name}</p>
                  <p className="cine-agent-line">{agent.voiceLine}</p>
                  <div className="cine-agent-actions">
                    <button
                      type="button"
                      className={`cine-agent-play${isLive ? " is-on" : ""}`}
                      aria-pressed={isLive}
                      aria-label={isLive ? `Stop ${agent.name}` : `Play ${agent.name}`}
                      onPointerDown={(e) => {
                        if (e.button !== 0) return;
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        playAgentVoice(agent.id);
                      }}
                    >
                      <span aria-hidden>{isLive ? "■" : "▶"}</span>
                      {isLive ? "Stop" : "Play voice"}
                    </button>
                    <span className="cine-agent-metric">{agent.metric}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside
          aria-live="polite"
          className={`cine-char${active ? " is-on" : ""}${isSpeaking ? " is-speaking" : ""}`}
          ref={charRef}
        >
          {!active || !char ? (
            <div className="cine-char-empty">
              <span className="cine-char-empty-mark" aria-hidden>
                ⌖
              </span>
              <p className="cine-char-empty-kicker">Character select</p>
              <p className="cine-char-empty-copy">
                Hover a card or hit play — the agent steps onto the stage.
              </p>
            </div>
          ) : (
            <>
              <div className="cine-char-frame cine-char-anim">
                <div className="cine-char-crops" aria-hidden>
                  <span className="tl" />
                  <span className="tr" />
                  <span className="bl" />
                  <span className="br" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="cine-char-portrait"
                  decoding="async"
                  key={active.id}
                  src={active.image}
                />
                <div className="cine-char-hud">
                  <span className="cine-char-code">{char.codename}</span>
                  {isSpeaking ? (
                    <span className="cine-char-live">
                      <span className="cine-char-eq" aria-hidden>
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                      Speaking
                    </span>
                  ) : (
                    <span className="cine-char-idle">Standby</span>
                  )}
                </div>
              </div>

              <div className="cine-char-plate">
                <p className="cine-char-class cine-char-anim">{char.role}</p>
                <h3 className="cine-char-name cine-char-anim">{active.name}</h3>
                <p className="cine-char-metric cine-char-anim">{active.metric}</p>

                <ul className="cine-char-lines">
                  {char.lines.map((line) => (
                    <li className="cine-char-anim" key={line}>
                      <span aria-hidden className="cine-char-bullet">
                        /
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="cine-char-stats cine-char-anim">
                  {active.channels.map((ch) => (
                    <span key={ch}>{ch}</span>
                  ))}
                </div>

                <p className="cine-char-blurb cine-char-anim">{active.blurb}</p>

                <div className="cine-char-foot cine-char-anim">
                  <button
                    type="button"
                    className={`cine-char-play${isSpeaking && playingId === active.id ? " is-on" : ""}`}
                    onClick={() => playAgentVoice(active.id)}
                  >
                    {isSpeaking && playingId === active.id ? "Stop voice" : "Play intro"}
                  </button>
                  <a className="cine-link" href={active.href}>
                    Meet {active.name} <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="cine-motion-foot">
        <p>
          Domain-trained agents with chat, tools, and live voice — deploy from Studio in days, not
          quarters.
        </p>
        <a className="cine-link" href="https://studio.lyzr.ai/">
          Open Agent Studio <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
