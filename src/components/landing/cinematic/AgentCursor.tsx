"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "idle" | "engage" | "text";

function isTextTarget(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    (el as HTMLElement).isContentEditable
  );
}

function isEngageTarget(el: Element | null) {
  if (!el) return false;
  return Boolean(
    el.closest(
      "a, button, [role='button'], .cine-nav-btn, .cine-pill, .cine-link, .cine-cookie-btn, summary, label[for]",
    ),
  );
}

/**
 * Agent-focus reticle: node + scan ring + crop ticks.
 * Reads as an AI agent attending to the pointer — not a novelty blob.
 */
export function AgentCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const raf = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-agent-cursor");
    let shown = false;

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      if (!shown) {
        shown = true;
        setVisible(true);
      }

      const t = document.elementFromPoint(e.clientX, e.clientY);
      if (isTextTarget(t)) setMode("text");
      else if (isEngageTarget(t)) setMode("engage");
      else setMode("idle");
    };

    const onLeave = () => {
      shown = false;
      setVisible(false);
    };
    const onEnter = () => {
      shown = true;
      setVisible(true);
    };

    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.28;
      p.y += (p.ty - p.y) * 0.28;
      const el = rootRef.current;
      if (el) {
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-agent-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className={`agent-cursor${visible ? " is-on" : ""}${mode !== "idle" ? ` is-${mode}` : ""}`}
      ref={rootRef}
    >
      <span className="agent-cursor-ring" />
      <span className="agent-cursor-node" />
      <span className="agent-cursor-tick t" />
      <span className="agent-cursor-tick r" />
      <span className="agent-cursor-tick b" />
      <span className="agent-cursor-tick l" />
      <span className="agent-cursor-label">agent</span>
    </div>
  );
}
