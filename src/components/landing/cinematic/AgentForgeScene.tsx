"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

type Props = {
  className?: string;
  progressRef: MutableRefObject<number>;
};

const STEPS = [
  { at: 0.02, label: "Open Lyzr" },
  { at: 0.2, label: "Human arrives" },
  { at: 0.4, label: "Build in Studio" },
  { at: 0.62, label: "Agent appears" },
  { at: 0.82, label: "Go live" },
  { at: 0.94, label: "Govern" },
] as const;

/**
 * Story: a human walks into Lyzr, uses the product, and an agent is born from that use.
 * Scroll = watching someone build on Lyzr — not abstract chip assembly.
 */
export function AgentForgeScene({ className, progressRef }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let displayP = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.borderRadius = "inherit";
    mount.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const empty = new Image();
    const using = new Image();
    const emerges = new Image();
    let ready = 0;
    const mark = () => {
      ready += 1;
    };
    const loadImages = () => {
      empty.src = "/lyzr-studio-empty-alpha.webp";
      using.src = "/lyzr-human-using-studio-alpha.webp";
      emerges.src = "/lyzr-agent-emerges-alpha.webp";
    };
    [empty, using, emerges].forEach((img) => {
      img.decoding = "async";
      img.onload = mark;
      img.onerror = mark;
    });

    let imagesArmed = false;
    const armImages = () => {
      if (imagesArmed || disposed) return;
      imagesArmed = true;
      loadImages();
    };
    const nearIo = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          armImages();
          nearIo.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    nearIo.observe(mount);

    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d")!;

    const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
    const smoothstep = (t: number) => {
      const x = clamp01(t);
      return x * x * (3 - 2 * x);
    };
    const range = (p: number, a: number, b: number) =>
      clamp01((p - a) / Math.max(0.0001, b - a));
    const safe = (n: number) => (Number.isFinite(n) ? n : 0);

    const resize = () => {
      w = Math.max(1, mount.clientWidth);
      h = Math.max(1, mount.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buf.width = canvas.width;
      buf.height = canvas.height;
      bctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    resize();

    const sceneBox = () => {
      const figH = Math.min(h * 0.9, w * 1.05);
      const figW = figH * (2 / 3);
      const x = (w - figW) / 2;
      const y = h * 0.02;
      return { x, y, figW, figH };
    };

    const drawLayer = (
      img: HTMLImageElement,
      opacity: number,
      x: number,
      y: number,
      figW: number,
      figH: number,
      wipe?: number,
    ) => {
      if (!img.complete || img.naturalWidth === 0 || opacity < 0.02) return;
      const e = wipe == null ? 1 : clamp01(wipe);
      if (e < 0.01) return;

      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.globalCompositeOperation = "source-over";
      bctx.globalAlpha = 1;
      bctx.clearRect(0, 0, buf.width, buf.height);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.drawImage(img, x, y, figW, figH);

      if (wipe != null && e < 0.995) {
        bctx.globalCompositeOperation = "destination-in";
        const g = bctx.createLinearGradient(0, y, 0, y + figH);
        g.addColorStop(0, "#000");
        g.addColorStop(Math.max(0, e - 0.03), "#000");
        g.addColorStop(Math.min(1, e + 0.05), "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        bctx.fillStyle = g;
        bctx.fillRect(x - 4, y - 4, figW + 8, figH + 8);
        bctx.globalCompositeOperation = "source-over";
      }

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = opacity;
      ctx.drawImage(buf, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const fillRound = (
      x: number,
      y: number,
      rw: number,
      rh: number,
      r: number,
      fill: string,
      stroke?: string,
    ) => {
      if (rw < 1 || rh < 1) return;
      const rad = Math.min(Math.max(0, r), rw / 2, rh / 2);
      ctx.beginPath();
      ctx.moveTo(x + rad, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, rad);
      ctx.arcTo(x + rw, y + rh, x, y + rh, rad);
      ctx.arcTo(x, y + rh, x, y, rad);
      ctx.arcTo(x, y, x + rw, y, rad);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      if (disposed || !ctx) return;
      const t = now / 1000;
      const target = reduce ? 1 : clamp01(progressRef.current);
      displayP += (target - displayP) * (reduce ? 1 : 0.1);
      const p = safe(displayP);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Narrative phases
      const openStudio = smoothstep(range(p, 0.0, 0.14));
      const humanIn = smoothstep(range(p, 0.12, 0.38));
      const building = smoothstep(range(p, 0.28, 0.55));
      const agentOut = smoothstep(range(p, 0.48, 0.78));
      const live = smoothstep(range(p, 0.7, 0.9));
      const govern = smoothstep(range(p, 0.86, 1.0));
      const pct = Math.round(p * 100);

      const { x, y, figW, figH } = sceneBox();
      const cx = x + figW * 0.5;
      const cy = y + figH * 0.45;

      // Soft stage glow
      const spot = ctx.createRadialGradient(cx, cy, 12, cx, cy, figW * 0.9);
      spot.addColorStop(0, `rgba(255,255,255,${0.035 + live * 0.06})`);
      spot.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, w, h);

      // Blueprint grid while in Studio
      if (openStudio > 0.01 && govern < 0.95) {
        ctx.save();
        ctx.globalAlpha = 0.06 * openStudio * (1 - govern * 0.4);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        const step = 30;
        for (let gx = 0; gx < w; gx += step) {
          ctx.beginPath();
          ctx.moveTo(gx + 0.5, 0);
          ctx.lineTo(gx + 0.5, h);
          ctx.stroke();
        }
        for (let gy = 0; gy < h; gy += step) {
          ctx.beginPath();
          ctx.moveTo(0, gy + 0.5);
          ctx.lineTo(w, gy + 0.5);
          ctx.stroke();
        }
        ctx.restore();
      }

      if (ready > 0) {
        // 1) Empty Lyzr Studio (desk + product)
        const emptyA = 0.95 * openStudio * (1 - humanIn * 0.95);
        drawLayer(empty, emptyA, x, y, figW, figH, openStudio);

        // 2) Human sits down and uses Lyzr
        const usingA = humanIn * (1 - agentOut * 0.85) * (0.25 + humanIn * 0.75);
        drawLayer(using, usingA, x, y, figW, figH, humanIn);

        // 3) Agent is born from Lyzr — steps out of the product
        const emergeA = agentOut * (0.3 + agentOut * 0.7);
        drawLayer(emerges, emergeA, x, y, figW, figH, agentOut);
      }

      // Cursor / click pulse while human is building on Lyzr
      if (humanIn > 0.35 && agentOut < 0.55) {
        const pulse = 0.45 + Math.sin(t * 5) * 0.35;
        const ux = x + figW * 0.58;
        const uy = y + figH * 0.42;
        ctx.save();
        ctx.globalAlpha = 0.55 * building * pulse * (1 - agentOut);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(ux, uy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.2 * building * (1 - agentOut);
        ctx.beginPath();
        ctx.arc(ux, uy, 14 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Beam from screen → agent while emerging
      if (agentOut > 0.08 && agentOut < 0.92) {
        ctx.save();
        ctx.globalAlpha = 0.28 * agentOut * (1 - govern * 0.5);
        const beam = ctx.createLinearGradient(x + figW * 0.55, y + figH * 0.38, x + figW * 0.78, y + figH * 0.55);
        beam.addColorStop(0, "rgba(255,255,255,0.9)");
        beam.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = beam;
        ctx.lineWidth = 1.25;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(x + figW * 0.55, y + figH * 0.38);
        ctx.lineTo(x + figW * 0.78, y + figH * 0.55);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Live pulse + govern rings around the born agent
      if (live > 0.15) {
        ctx.save();
        ctx.translate(x + figW * 0.72, y + figH * 0.52);
        ctx.globalAlpha = 0.28 * live * (0.55 + Math.sin(t * 2.8) * 0.45);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, figW * 0.16, figH * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (govern > 0.05) {
          for (let i = 0; i < 2; i++) {
            const a = smoothstep(range(govern, i * 0.12, 0.5 + i * 0.2));
            ctx.globalAlpha = 0.35 * a;
            ctx.beginPath();
            ctx.ellipse(
              0,
              0,
              figW * (0.18 + i * 0.06) * (1.1 - a * 0.15),
              figH * (0.3 + i * 0.05) * (1.08 - a * 0.12),
              t * 0.1 * (i % 2 === 0 ? 1 : -1),
              0,
              Math.PI * 2,
            );
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // —— HUD story labels ——
      const status =
        p < 0.12
          ? "Lyzr Studio is open…"
          : p < 0.32
            ? "A human sits down to build…"
            : p < 0.52
              ? "Designing the agent on Lyzr…"
              : p < 0.72
                ? "Agent steps out of Lyzr…"
                : p < 0.88
                  ? "Agent online"
                  : "Governed on Lyzr";

      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.globalAlpha = 0.75 + openStudio * 0.25;
      ctx.fillStyle = "#fff";
      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(status, 16, 26);

      const barW = Math.min(240, w * 0.45);
      fillRound(16, 38, barW, 7, 3.5, "rgba(255,255,255,0.15)");
      fillRound(16, 38, Math.max(8, barW * p), 7, 3.5, "#fff");
      ctx.globalAlpha = 0.85;
      ctx.fillText(`${pct}%`, 16 + barW + 10, 45);

      let stepY = 66;
      ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      for (const step of STEPS) {
        const done = p >= step.at;
        const active = !done && p >= step.at - 0.1;
        ctx.globalAlpha = done ? 0.9 : active ? 0.75 : 0.28;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(22, stepY - 3, 3.5, 0, Math.PI * 2);
        if (done) ctx.fill();
        else {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.fillText(step.label, 34, stepY);
        stepY += 17;
      }

      // Corner stamps
      if (live > 0.4) {
        const stampA = smoothstep(range(live, 0.4, 1));
        ctx.save();
        ctx.translate(w - 32, h * 0.18);
        ctx.rotate(0.14);
        ctx.globalAlpha = 0.7 * stampA;
        fillRound(-78, -16, 156, 32, 4, "rgba(0,0,0,0)", "rgba(255,255,255,0.9)");
        ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(govern > 0.35 ? "ON LYZR" : "AGENT ONLINE", 0, 1);
        ctx.restore();
      }

      if (p > 0.05 && p < 0.48) {
        ctx.save();
        ctx.globalAlpha = 0.32 * (1 - agentOut) * (0.55 + Math.sin(t * 3.5) * 0.45);
        ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText("HUMAN → LYZR → AGENT", cx, h - 26);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      progressRef.current = 1;
      displayP = 1;
    }
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      nearIo.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, [progressRef]);

  return <div aria-hidden className={className} ref={mountRef} />;
}
