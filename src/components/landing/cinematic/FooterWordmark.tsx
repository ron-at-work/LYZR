"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useSound } from "../motion/SoundProvider";

/** Soft flute-friendly pentatonic (Hz) — Trionn footer string scale. */
const SCALE = [196, 220, 246.94, 293.66, 329.63, 392, 440, 493.88] as const;

type StringState = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  amp: number;
  phase: number;
  speed: number;
  cycles: number;
  note: number;
  intensity: number;
  path: SVGPathElement;
};

function makeWavePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  amp: number,
  phase: number,
  cycles: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= 28; i++) {
    const t = i / 28;
    const env = Math.sin(Math.PI * t);
    const wobble = Math.sin(Math.PI * 2 * cycles * t + phase);
    const x = x1 + dx * t + px * wobble * amp * env;
    const y = y1 + dy * t + py * wobble * amp * env;
    d += ` L ${x} ${y}`;
  }
  return d;
}

/**
 * Masked horizontal strings through “LYZR” — hover/click plucks a flute note
 * and waves the line (Trionn footer wire-logo pattern).
 */
export function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { muted, playPluck, toggleMuted } = useSound();
  const playPluckRef = useRef(playPluck);
  playPluckRef.current = playPluck;

  useEffect(() => {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const VB_W = 1200;
    const VB_H = 280;
    const PAD_X = 18;
    const LINE_COUNT = 22;
    const GAP = (VB_H - 48) / (LINE_COUNT - 1);
    const hoverAmp = 11;

    const displayVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-display")
      .trim();
    const fontFamily = displayVar
      ? `${displayVar}, system-ui, sans-serif`
      : getComputedStyle(wrap).fontFamily || "system-ui, sans-serif";

    const ns = "http://www.w3.org/2000/svg";
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const defs = document.createElementNS(ns, "defs");
    const mask = document.createElementNS(ns, "mask");
    mask.setAttribute("id", "cine-lyzr-mask");
    mask.setAttribute("maskUnits", "userSpaceOnUse");

    const maskBg = document.createElementNS(ns, "rect");
    maskBg.setAttribute("width", String(VB_W));
    maskBg.setAttribute("height", String(VB_H));
    maskBg.setAttribute("fill", "#000");
    mask.appendChild(maskBg);

    const maskText = document.createElementNS(ns, "text");
    maskText.setAttribute("x", "50%");
    maskText.setAttribute("y", "54%");
    maskText.setAttribute("text-anchor", "middle");
    maskText.setAttribute("dominant-baseline", "middle");
    maskText.setAttribute("fill", "#fff");
    maskText.setAttribute("font-family", fontFamily);
    maskText.setAttribute("font-weight", "700");
    maskText.setAttribute("font-size", "248");
    maskText.setAttribute("letter-spacing", "-16");
    maskText.textContent = "LYZR";
    mask.appendChild(maskText);
    defs.appendChild(mask);
    svg.appendChild(defs);

    const group = document.createElementNS(ns, "g");
    group.setAttribute("mask", "url(#cine-lyzr-mask)");
    svg.appendChild(group);

    const hitLayer = document.createElementNS(ns, "g");
    hitLayer.setAttribute("aria-hidden", "true");
    svg.appendChild(hitLayer);

    const strings: StringState[] = [];
    const cleanups: Array<() => void> = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      const y = 24 + i * GAP;
      const path = document.createElementNS(ns, "path");
      const x1 = PAD_X;
      const x2 = VB_W - PAD_X;
      const d0 = `M ${x1} ${y} L ${x2} ${y}`;
      path.setAttribute("d", d0);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(255,255,255,0.88)");
      path.setAttribute("stroke-width", i % 3 === 0 ? "1.35" : "0.9");
      path.setAttribute("stroke-linecap", "round");
      path.style.pointerEvents = "none";
      group.appendChild(path);

      const state: StringState = {
        x1,
        y1: y,
        x2,
        y2: y,
        amp: 0,
        phase: 0,
        speed: 0,
        cycles: 2.1 + (i % 4) * 0.18,
        note: SCALE[i % SCALE.length]! * (i % 2 ? 1 : 0.5),
        intensity: Math.pow(i / (LINE_COUNT - 1), 1.15),
        path,
      };
      strings.push(state);

      const hit = document.createElementNS(ns, "path");
      hit.setAttribute("d", d0);
      hit.setAttribute("fill", "none");
      hit.setAttribute("stroke", "transparent");
      hit.setAttribute("stroke-width", "14");
      hit.setAttribute("pointer-events", "stroke");
      hit.style.cursor = "crosshair";
      hitLayer.appendChild(hit);

      const pluck = () => {
        gsap.killTweensOf(state);
        state.amp = hoverAmp;
        state.speed = 18;
        gsap.to(state, { amp: 0, duration: 0.95, ease: "expo.out" });
        gsap.to(state, { speed: 0, duration: 0.95, ease: "expo.out" });
        playPluckRef.current(state.note, state.intensity);
      };

      hit.addEventListener("pointerenter", pluck);
      hit.addEventListener("click", pluck);
      cleanups.push(() => {
        hit.removeEventListener("pointerenter", pluck);
        hit.removeEventListener("click", pluck);
      });
    }

    let raf = 0;
    let last = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      for (const st of strings) {
        if (st.amp > 0.02 || st.speed > 0.02) {
          st.phase += st.speed * dt;
          st.path.setAttribute(
            "d",
            makeWavePath(st.x1, st.y1, st.x2, st.y2, st.amp, st.phase, st.cycles),
          );
        } else if (st.amp !== 0) {
          st.amp = 0;
          st.speed = 0;
          st.path.setAttribute("d", `M ${st.x1} ${st.y1} L ${st.x2} ${st.y2}`);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    if (!reduce) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      for (const st of strings) gsap.killTweensOf(st);
      for (const off of cleanups) off();
    };
  }, []);

  return (
    <div className="cine-line-word font-display" ref={wrapRef}>
      <svg
        aria-hidden
        className="cine-line-word-svg"
        ref={svgRef}
        viewBox="0 0 1200 280"
        preserveAspectRatio="xMidYMid meet"
      />
      <span className="sr-only">LYZR</span>
      {muted ? (
        <button className="cine-line-word-unmute" onClick={toggleMuted} type="button">
          Enable sound to play the strings
        </button>
      ) : null}
    </div>
  );
}
