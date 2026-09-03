'use client';

import { useEffect, useState } from "react";
import { NAV_EXT, WORKFORCE_AGENTS, type WorkforceAgentId } from "../data";

export function WorkforceSection() {
  const [activeWorkforce, setActiveWorkforce] = useState<WorkforceAgentId>("jeff");
  const [voiceDemoOn, setVoiceDemoOn] = useState(false);
  const activeAgent = WORKFORCE_AGENTS.find((a) => a.id === activeWorkforce) ?? WORKFORCE_AGENTS[0];

  const stopAgentVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceDemoOn(false);
  };

  const playAgentVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (voiceDemoOn) {
      stopAgentVoice();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeAgent.voiceScript);
    utterance.rate = 1.02;
    utterance.pitch = 1;
    utterance.onend = () => setVoiceDemoOn(false);
    utterance.onerror = () => setVoiceDemoOn(false);

    let started = false;
    const speak = () => {
      if (started) return;
      started = true;
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /en(-|_)?(US|GB|IN)?/i.test(v.lang) && /female|samantha|karen|moira|zira/i.test(v.name)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
        null;
      if (preferred) utterance.voice = preferred;
      setVoiceDemoOn(true);
      window.speechSynthesis.speak(utterance);
      window.setTimeout(() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 40);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", speak, { once: true });
      window.setTimeout(speak, 300);
    } else {
      speak();
    }
  };

  const selectWorkforceAgent = (id: WorkforceAgentId) => {
    if (id !== activeWorkforce) stopAgentVoice();
    setActiveWorkforce(id);
  };

  const renderWorkforceFeatured = (variant: "desktop" | "mobile") => (
    <div
      className={`workforce-featured bg-surface-card workforce-featured--${variant}`}
      key={`${variant}-${activeAgent.id}`}
      id={variant === "mobile" ? `workforce-agent-${activeAgent.id}` : undefined}
    >
      {variant === "desktop" ? (
        <div className="workforce-portrait-wrap">
          <img
            alt={`${activeAgent.name} — Lyzr agent`}
            className="workforce-portrait"
            src={activeAgent.image}
            width={480}
            height={464}
            decoding="async"
            loading="lazy"
          />
          {activeAgent.voice ? (
            <span className="workforce-portrait-live">
              <span className="workforce-voice-pill-dot" aria-hidden="true" />
              Voice
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="workforce-featured-body">
        <div className="workforce-featured-top">
          {variant === "desktop" ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[22px] font-semibold text-text-primary tracking-tight">{activeAgent.name}</h3>
                  {activeAgent.voice ? (
                    <span className="workforce-badge workforce-badge--voice">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                        graphic_eq
                      </span>
                      Voice ready
                    </span>
                  ) : (
                    <span className="workforce-badge">Text &amp; tools</span>
                  )}
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted mt-1 block">
                  {activeAgent.dept}
                </span>
              </div>
              <span className="workforce-featured-metric">{activeAgent.metric}</span>
            </div>
          ) : (
            <div className="workforce-expand-meta">
              {activeAgent.voice ? (
                <span className="workforce-badge workforce-badge--voice">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                    graphic_eq
                  </span>
                  Voice ready
                </span>
              ) : (
                <span className="workforce-badge">Text &amp; tools</span>
              )}
              <span className="workforce-featured-metric workforce-featured-metric--compact">{activeAgent.metric}</span>
            </div>
          )}
          <p className="text-[15px] text-text-secondary leading-relaxed mt-space-16 max-w-[48ch]">
            {activeAgent.blurb}
          </p>
        </div>

        {activeAgent.voice ? (
          <div className={`workforce-voice-panel${voiceDemoOn ? " is-live" : ""}`}>
            <div className="workforce-wave" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
            <div className="workforce-voice-meta">
              <p className="workforce-voice-line">{activeAgent.voiceLine}</p>
              <p className="workforce-voice-stack">
                {voiceDemoOn ? `Playing ${activeAgent.name}…` : "Tap play to hear this agent"}
              </p>
            </div>
            <button
              type="button"
              className={`workforce-mic${voiceDemoOn ? " is-on" : ""}`}
              aria-pressed={voiceDemoOn}
              aria-label={voiceDemoOn ? `Stop ${activeAgent.name}` : `Play ${activeAgent.name}`}
              onClick={playAgentVoice}
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                {voiceDemoOn ? "stop" : "play_arrow"}
              </span>
              <span className="sr-only">
                {voiceDemoOn ? `Stop ${activeAgent.name}` : `Play ${activeAgent.name}`}
              </span>
            </button>
          </div>
        ) : (
          <div className={`workforce-voice-panel workforce-voice-panel--quiet${voiceDemoOn ? " is-live" : ""}`}>
            <button
              type="button"
              className={`workforce-mic workforce-mic--light${voiceDemoOn ? " is-on" : ""}`}
              onClick={playAgentVoice}
              aria-pressed={voiceDemoOn}
              aria-label={voiceDemoOn ? `Stop ${activeAgent.name}` : `Play ${activeAgent.name}`}
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                {voiceDemoOn ? "stop" : "play_arrow"}
              </span>
            </button>
            <div>
              <p className="text-[13.5px] text-text-primary font-medium leading-snug">{activeAgent.voiceLine}</p>
              <p className="text-[12px] font-mono text-text-muted mt-1.5">
                {voiceDemoOn ? `Playing ${activeAgent.name}…` : "Preview intro · enable Voice Agent anytime in Studio"}
              </p>
            </div>
          </div>
        )}

        <div className="workforce-featured-foot">
          <div className="flex flex-wrap gap-2">
            {activeAgent.channels.map((ch) => (
              <span key={ch} className="workforce-channel">
                {ch}
              </span>
            ))}
          </div>
          <a className="workforce-cta" href={activeAgent.href} {...NAV_EXT}>
            Meet {activeAgent.name}
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              arrow_outward
            </span>
          </a>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    stopAgentVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stop prior agent audio when selection changes
  }, [activeWorkforce]);

  return (
    <>
      {/* 11. PRE-BUILT AGENTS CATALOG — VOICE-READY WORKFORCE */}
      <section className="workforce-section w-full bg-brand-ink border-y border-border-crisp section-y" id="catalog">
        <div className="max-w-container-max mx-auto page-pad">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-24 mb-space-40">
            <div className="max-w-2xl">
              <span className="text-[11.5px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2">Turnkey Workforce</span>
              <h2 className="font-display display-h2 font-medium text-text-primary">
                Ready-to-deploy{" "}
                <span className="font-editorial-italic text-primary">autonomous agents.</span>
              </h2>
              <p className="text-[16px] text-text-secondary mt-space-12 max-w-[52ch]">
                Domain-trained coworkers for every function — chat, tools, and <em className="not-italic text-primary font-medium">live voice</em> with telephony in Agent Studio.
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="workforce-voice-pill">
                <span className="workforce-voice-pill-dot" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-widest">Voice agents live in Studio</span>
              </div>
              <a className="text-[13px] font-medium text-primary hover:text-primary-dark inline-flex items-center gap-1" href="https://studio.lyzr.ai/" {...NAV_EXT}>
                View full agent registry <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="workforce-stage">
            {/* Desktop: master–detail stage */}
            {renderWorkforceFeatured("desktop")}

            {/* Agent picker — mobile expands details under the selected row */}
            <div className="workforce-rail" role="listbox" aria-label="Select an agent">
              {WORKFORCE_AGENTS.map((agent) => {
                const selected = agent.id === activeWorkforce;
                return (
                  <div
                    key={agent.id}
                    className={`workforce-rail-item${selected ? " is-active" : ""}`}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-controls={selected ? `workforce-agent-${agent.id}` : undefined}
                      className={`workforce-rail-card${selected ? " is-active" : ""}${agent.voice ? " has-voice" : ""}`}
                      onClick={() => selectWorkforceAgent(agent.id)}
                    >
                      <span className="workforce-rail-thumb">
                        <img
                          alt=""
                          src={agent.image}
                          width={64}
                          height={64}
                          decoding="async"
                          loading="lazy"
                        />
                      </span>
                      <span className="workforce-rail-body">
                        <span className="workforce-rail-name">
                          {agent.name}
                          {agent.voice ? <span className="workforce-rail-eq" aria-hidden="true" /> : null}
                        </span>
                        <span className="workforce-rail-dept">{agent.dept}</span>
                        <span className="workforce-rail-metric">{agent.metric}</span>
                      </span>
                      <span className="workforce-rail-chevron material-symbols-outlined" aria-hidden="true">
                        {selected ? "expand_less" : "expand_more"}
                      </span>
                    </button>
                    {selected ? renderWorkforceFeatured("mobile") : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="workforce-stack-bar">
            <div className="workforce-stack-item">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">call</span>
              <span>Telephony inbound &amp; outbound</span>
            </div>
            <div className="workforce-stack-item">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">hearing</span>
              <span>Deepgram speech-to-text</span>
            </div>
            <div className="workforce-stack-item">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">record_voice_over</span>
              <span>ElevenLabs natural TTS</span>
            </div>
            <div className="workforce-stack-item">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">toggle_on</span>
              <span>One toggle in Agent Studio</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
