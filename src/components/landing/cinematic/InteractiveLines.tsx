'use client';

import { useEffect, useRef } from "react";

type Props = {
  blast?: boolean;
};

/** Full-field diagonal wire lines — Trionn-style "touch the lines". */
export function InteractiveLines({ blast = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const blastRef = useRef(blast);

  useEffect(() => {
    blastRef.current = blast;
  }, [blast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    type Pt = { x: number; y: number; ox: number; oy: number };
    let lines: Pt[][] = [];

    const rebuild = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      lines = [];
      const count = 28;
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x0 = -w * 0.15 + t * w * 1.3;
        const y0 = -h * 0.1;
        const x1 = x0 - w * 0.35;
        const y1 = h * 1.15;
        const segs = 18;
        const pts: Pt[] = [];
        for (let s = 0; s <= segs; s++) {
          const u = s / segs;
          const ox = x0 + (x1 - x0) * u;
          const oy = y0 + (y1 - y0) * u;
          pts.push({ x: ox, y: oy, ox, oy });
        }
        lines.push(pts);
      }

      // Cross hatch
      for (let i = 0; i < 16; i++) {
        const t = i / 15;
        const x0 = w * 1.1 - t * w * 1.25;
        const y0 = -h * 0.05;
        const x1 = x0 + w * 0.4;
        const y1 = h * 1.1;
        const segs = 14;
        const pts: Pt[] = [];
        for (let s = 0; s <= segs; s++) {
          const u = s / segs;
          const ox = x0 + (x1 - x0) * u;
          const oy = y0 + (y1 - y0) * u;
          pts.push({ x: ox, y: oy, ox, oy });
        }
        lines.push(pts);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = (e.clientX - rect.left) / rect.width;
      mouse.current.ty = (e.clientY - rect.top) / rect.height;
    };

    const draw = () => {
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.08;

      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x * w;
      const my = mouse.current.y * h;
      const energy = blastRef.current ? 2.8 : 1;

      for (const pts of lines) {
        for (const n of pts) {
          const dx = n.ox - mx;
          const dy = n.oy - my;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const force = Math.min(110, (18000 * energy) / dist);
          n.x = n.ox + (dx / dist) * force * 0.28;
          n.y = n.oy + (dy / dist) * force * 0.28;
        }

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        const mid = pts[Math.floor(pts.length / 2)];
        const d = Math.hypot(mid.x - mx, mid.y - my);
        const hot = Math.max(0, 1 - d / 280);
        // Soft punch-out around the 3D mark so solid ink reads clearly
        const markCx = w * 0.5;
        const markCy = h * 0.46;
        const markDist = Math.hypot(mid.x - markCx, mid.y - markCy);
        const markR = Math.min(w, h) * 0.32;
        const markFade = Math.min(1, Math.max(0.12, (markDist - markR * 0.35) / (markR * 0.85)));
        const alpha = (0.045 + hot * 0.2) * markFade * (blastRef.current ? 1.35 : 1);
        ctx.strokeStyle = blastRef.current
          ? `rgba(220, 90, 40, ${alpha})`
          : `rgba(40, 36, 30, ${alpha})`;
        ctx.lineWidth = hot > 0.4 ? 1.05 : 0.55;
        ctx.stroke();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    rebuild();
    draw();
    window.addEventListener("resize", rebuild);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas aria-hidden className="cine-hero-canvas" ref={canvasRef} />;
}
