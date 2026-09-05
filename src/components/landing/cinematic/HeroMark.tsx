"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  className?: string;
  blast?: boolean;
};

type Shard = {
  mesh: THREE.Object3D;
  /** Centroid in group space (geometry still includes this offset). */
  homePos: THREE.Vector3;
  /** Extra radial push multiplier (slight depth variance, Trionn-style). */
  expandMul: number;
  /** Tiny z lift so plates separate in depth without tumbling. */
  depthLift: number;
  delay: number;
  shapeIdx: number;
  /** Per-shard explode velocity (world-ish, group local). */
  boomVel: THREE.Vector3;
  boomSpin: THREE.Vector3;
  isEdge?: boolean;
};

type AgentBit = {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  spin: THREE.Vector3;
  seed: THREE.Vector3;
  phase: number;
  size: number;
};

type TermLabel = {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  seed: THREE.Vector3;
  phase: number;
  w: number;
  h: number;
};

/**
 * 3D Lyzr mark only (inner glyph — no plate/squircle).
 * Warm-white theme: dark glass that expands on scroll like Trionn —
 * silhouette stays, gaps open (radial fail-open).
 * Hold → haptic buzz → mark explodes into agent particles + AI terms.
 */
export function HeroMark({ className, blast = false }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const blastRef = useRef(blast);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    blastRef.current = blast;
  }, [blast]);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = Math.max(1, mount.clientWidth || window.innerWidth);
    let h = Math.max(1, mount.clientHeight || window.innerHeight);
    let disposed = false;

    /** AI term billboards: ~0.72 phone → 1.0 laptop → 1.15 large desktop. */
    const termScreenMul = () => {
      const vw = Math.max(320, window.innerWidth);
      const t = (vw - 360) / (1280 - 360);
      return Math.min(1.15, Math.max(0.72, 0.72 + t * 0.28));
    };
    let screenMul = termScreenMul();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    // Ensure canvas isn't clipped / zero-sized in some browsers
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 80);
    camera.position.set(0, 0.12, 5.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(3, 4.5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xf0ebe3, 1.1);
    fill.position.set(-3.5, 1.2, 2.5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xd8d2c8, 0.55);
    rim.position.set(-2, 2.5, -3);
    scene.add(rim);
    const warm = new THREE.PointLight(0xff7a3a, 1.15, 16, 2);
    warm.position.set(0.3, 0.1, 2.2);
    scene.add(warm);
    const cool = new THREE.PointLight(0xa8c4ff, 0.45, 14, 2);
    scene.add(cool);

    const cubeRT = new THREE.WebGLCubeRenderTarget(128, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 80, cubeRT);
    scene.add(cubeCamera);

    // Soft ground contact for white theme depth
    const floorGeo = new THREE.CircleGeometry(2.8, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xe8e4dc,
      metalness: 0.05,
      roughness: 0.85,
      transparent: true,
      opacity: 0.45,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.35;
    scene.add(floor);

    const inkMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      emissive: new THREE.Color(0x2a1408),
      emissiveIntensity: 0.06,
      metalness: 0.55,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      envMap: cubeRT.texture,
      envMapIntensity: 1.35,
      side: THREE.DoubleSide,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x3a3a3a,
      transparent: true,
      opacity: 0.28,
    });

    const group = new THREE.Group();
    scene.add(group);
    const agentRoot = new THREE.Group();
    scene.add(agentRoot);
    agentRoot.visible = false;
    const shards: Shard[] = [];
    const agents: AgentBit[] = [];
    const terms: TermLabel[] = [];
    const geos: THREE.BufferGeometry[] = [floorGeo];
    const mats: THREE.Material[] = [inkMat, edgeMat, floorMat];

    const AI_TERMS = [
      "OpenAI",
      "LLM",
      "GPT-4o",
      "Claude",
      "Gemini",
      "LangChain",
      "Agents",
      "RAG",
      "Bedrock",
      "Azure AI",
      "Embeddings",
      "Vector DB",
      "Fine-tune",
      "Tool use",
      "MCP",
      "Orchestration",
      "Eval",
      "Guardrails",
      "Multi-agent",
      "Inference",
      "Tokens",
      "Context",
      "Prompt",
      "Memory",
    ] as const;

    const makeTermTexture = (label: string) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      // Sharper glyphs on retina; world size still driven by screenMul
      const fontPx = Math.round(42 * Math.min(2, window.devicePixelRatio || 1));
      const padX = Math.round(28 * (fontPx / 42));
      const padY = Math.round(16 * (fontPx / 42));
      ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
      const tw = Math.ceil(ctx.measureText(label).width);
      canvas.width = tw + padX * 2;
      canvas.height = fontPx + padY * 2;
      // redraw after resize
      ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      // pill
      const r = canvas.height / 2;
      ctx.fillStyle = "rgba(18, 18, 18, 0.92)";
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, r);
      ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, r);
      ctx.arcTo(0, canvas.height, 0, 0, r);
      ctx.arcTo(0, 0, canvas.width, 0, r);
      ctx.closePath();
      ctx.fill();
      // hairline
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = Math.max(1.5, 2 * (fontPx / 42));
      ctx.stroke();
      // label
      ctx.fillStyle = "#f5f2ec";
      ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 1);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return { tex, aspect: canvas.width / canvas.height };
    };

    const spawnTerms = () => {
      AI_TERMS.forEach((label, i) => {
        const { tex, aspect } = makeTermTexture(label);
        // Base world height; live screenMul applied in the draw loop
        const h = 0.16 + (i % 3) * 0.02;
        const w = h * aspect;
        const geo = new THREE.PlaneGeometry(w, h);
        geos.push(geo);
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        mats.push(mat);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false;
        mesh.visible = false;
        agentRoot.add(mesh);

        const ang = (i / AI_TERMS.length) * Math.PI * 2 + Math.random() * 0.2;
        const elev = (Math.random() - 0.5) * 1.1;
        const dist = 0.55 + Math.random() * 1.35;
        terms.push({
          mesh,
          vel: new THREE.Vector3(
            Math.cos(ang) * (1.4 + Math.random() * 1.6),
            elev * (1.2 + Math.random()),
            Math.sin(ang) * (1.2 + Math.random() * 1.4),
          ),
          seed: new THREE.Vector3(Math.cos(ang) * 0.2, elev * 0.15, Math.sin(ang) * 0.2),
          phase: Math.random() * Math.PI * 2,
          w,
          h,
        });
        // keep dist used via vel magnitude — nudge seed out a bit
        terms[terms.length - 1].seed.multiplyScalar(dist * 0.4);
      });
    };

    // Soft agent-node materials (ink + warm/cool accents)
    const agentInk = inkMat.clone();
    agentInk.transparent = true;
    agentInk.opacity = 0.92;
    agentInk.emissiveIntensity = 0.2;
    const agentWarm = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      emissive: new THREE.Color(0xff6a2a),
      emissiveIntensity: 0.55,
      metalness: 0.4,
      roughness: 0.3,
      clearcoat: 0.7,
      envMap: cubeRT.texture,
      envMapIntensity: 1.1,
      transparent: true,
      opacity: 0.9,
    });
    const agentCool = new THREE.MeshPhysicalMaterial({
      color: 0x141820,
      emissive: new THREE.Color(0x6a9fff),
      emissiveIntensity: 0.45,
      metalness: 0.5,
      roughness: 0.28,
      clearcoat: 0.8,
      envMap: cubeRT.texture,
      envMapIntensity: 1.2,
      transparent: true,
      opacity: 0.88,
    });
    mats.push(agentInk, agentWarm, agentCool);

    const sphereGeo = new THREE.SphereGeometry(1, 16, 12);
    const octaGeo = new THREE.OctahedronGeometry(1, 0);
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    geos.push(sphereGeo, octaGeo, boxGeo);

    const spawnAgents = (count: number) => {
      for (let i = 0; i < count; i += 1) {
        const kind = i % 5;
        const geo = kind === 0 || kind === 1 ? sphereGeo : kind === 2 ? octaGeo : boxGeo;
        const mat =
          kind === 0 || kind === 3 ? agentInk.clone() : kind === 1 || kind === 4 ? agentWarm.clone() : agentCool.clone();
        mats.push(mat);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false;
        mesh.visible = false;
        const size = 0.035 + Math.random() * 0.055;
        mesh.scale.setScalar(size);
        agentRoot.add(mesh);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 0.15 + Math.random() * 0.35;
        agents.push({
          mesh,
          vel: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * (1.2 + Math.random() * 2.4),
            Math.sin(phi) * Math.sin(theta) * (1.2 + Math.random() * 2.4),
            Math.cos(phi) * (1.0 + Math.random() * 2.0),
          ),
          spin: new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
          ),
          seed: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * r,
            Math.sin(phi) * Math.sin(theta) * r,
            Math.cos(phi) * r,
          ),
          phase: Math.random() * Math.PI * 2,
          size,
        });
      }
    };
    spawnAgents(48);
    spawnTerms();

    // Spark trail points
    const sparkCount = 140;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    geos.push(sparkGeo);
    const sparkMat = new THREE.PointsMaterial({
      color: 0xff8a4a,
      size: 0.045,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    });
    mats.push(sparkMat);
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    sparks.frustumCulled = false;
    agentRoot.add(sparks);
    const sparkVel: THREE.Vector3[] = [];
    for (let i = 0; i < sparkCount; i += 1) {
      sparkVel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
        ),
      );
      sparkPos[i * 3] = 0;
      sparkPos[i * 3 + 1] = 0;
      sparkPos[i * 3 + 2] = 0;
    }

    const pushShard = (mesh: THREE.Object3D, shapeIdx: number, isEdge = false) => {
      shards.push({
        mesh,
        homePos: new THREE.Vector3(0, 0, 0),
        expandMul: isEdge ? 1 : 0.96 + Math.random() * 0.08,
        depthLift: isEdge ? 0 : (Math.random() - 0.5) * 0.22,
        delay: isEdge ? 0 : shapeIdx * 0.012,
        shapeIdx,
        boomVel: new THREE.Vector3(),
        boomSpin: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3,
        ),
        isEdge,
      });
    };

    /** Each SVG path = one solid plate. Radial fail-open keeps the silhouette (Trionn). */
    const addExtrudedPlate = (geo: THREE.ExtrudeGeometry, shapeIdx: number) => {
      geos.push(geo);
      geo.computeBoundingBox();
      geo.computeVertexNormals();
      const mat = inkMat.clone();
      mats.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      group.add(mesh);
      pushShard(mesh, shapeIdx);

      const edges = new THREE.EdgesGeometry(geo, 24);
      geos.push(edges);
      const edge = new THREE.LineSegments(edges, edgeMat);
      group.add(edge);
      pushShard(edge, shapeIdx, true);
    };

    const state = {
      scrollProgress: 0,
      targetScrollProgress: 0,
      mergeProgress: 0,
      targetMerge: 0,
      // About path: right (small) → hold right → center → down
      pathX: 0,
      pathY: 0,
      targetPathX: 0,
      targetPathY: 0,
      aboutScale: 1,
      targetAboutScale: 1,
      // Stay assembled on hero — scatter only from scroll (not an intro blast)
      introAmt: 0,
      clickBurst: 0,
      holdTime: 0,
      holding: false,
      vibrateAmt: 0,
      vibratePhase: 0,
      rotX: 0.18,
      rotY: 0.28,
      mouseX: 0,
      mouseY: 0,
      baseY: 0,
      baseScale: 1,
      built: false,
    };

    /** Piecewise path while About is on screen — park small on the right first. */
    const sampleAboutPath = (t: number) => {
      const pts = [
        { t: 0, x: 1.55, y: 0.06, s: 0.55 }, // right empty space, smaller
        { t: 0.38, x: 1.7, y: 0.1, s: 0.52 }, // hold on right while copy reads
        { t: 0.58, x: 0.28, y: 0.85, s: 0.72 }, // then up-center
        { t: 0.78, x: 1.4, y: 0.12, s: 0.6 }, // right again
        { t: 1, x: 0.28, y: -0.95, s: 0.7 }, // down center
      ];
      const clamped = Math.max(0, Math.min(1, t));
      let i = 0;
      while (i < pts.length - 1 && pts[i + 1].t < clamped) i += 1;
      const a = pts[i];
      const b = pts[Math.min(i + 1, pts.length - 1)];
      const span = Math.max(0.0001, b.t - a.t);
      const u = (clamped - a.t) / span;
      const e = u * u * (3 - 2 * u);
      return {
        x: a.x + (b.x - a.x) * e,
        y: a.y + (b.y - a.y) * e,
        s: a.s + (b.s - a.s) * e,
      };
    };

    // Glyph only — never the plate/squircle
    new SVGLoader().load(
      "/lyzr-glyph-3d.svg",
      (data) => {
        if (disposed) return;
        const extrude: THREE.ExtrudeGeometryOptions = {
          depth: 42,
          bevelEnabled: true,
          bevelThickness: 5,
          bevelSize: 4,
          bevelSegments: 3,
          curveSegments: 10,
        };

        let shapeIdx = 0;
        data.paths.forEach((path) => {
          SVGLoader.createShapes(path).forEach((shape) => {
            addExtrudedPlate(new THREE.ExtrudeGeometry(shape, extrude), shapeIdx++);
          });
        });

        // Center ALL geometry on origin so group rotation spins in place
        // (not revolving around an offset pivot)
        const box = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        group.traverse((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
            obj.geometry.translate(-center.x, -center.y, -center.z);
            obj.geometry.computeBoundingBox();
            obj.geometry.computeBoundingSphere();
            obj.frustumCulled = false;
          }
        });

        shards.forEach((s) => {
          const geo =
            s.mesh instanceof THREE.Mesh || s.mesh instanceof THREE.LineSegments
              ? s.mesh.geometry
              : null;
          if (!geo) return;
          geo.computeBoundingBox();
          const c = new THREE.Vector3();
          geo.boundingBox!.getCenter(c);
          s.homePos.copy(c);
          if (s.isEdge) {
            s.expandMul = 1;
            s.depthLift = 0;
            s.boomVel.set(
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 120,
            );
            return;
          }
          const r = Math.hypot(c.x, c.y);
          // Outer plates open a touch more than the core — still one silhouette
          s.expandMul = 0.96 + Math.min(0.18, r * 0.001) + Math.random() * 0.04;
          s.depthLift = (Math.random() - 0.5) * 0.2;
          // Explode outward from centroid
          const len = Math.max(0.001, r);
          s.boomVel.set(
            (c.x / len) * (180 + Math.random() * 220),
            (c.y / len) * (180 + Math.random() * 220),
            (Math.random() - 0.5) * 160,
          );
        });

        const s = 2.55 / Math.max(size.x, size.y, 0.001);
        state.baseScale = s;
        state.built = true;
        group.scale.set(s, -s, s);
        group.position.set(0, 0.08, 0);
        state.baseY = 0.08;
        mount.style.opacity = "1";
        mount.style.zIndex = "1";
        mount.dataset.shards = String(shards.length);
        mount.dataset.size = `${size.x.toFixed(1)}x${size.y.toFixed(1)}`;
        mount.dataset.scale = String(s);

        // Force one lit frame so the hero mark is definitely painted
        cubeCamera.update(renderer, scene);
        renderer.render(scene, camera);
        ScrollTrigger.refresh();
      },
      undefined,
      () => console.warn("glyph svg failed"),
    );

    const hero = document.getElementById("top");
    const about = document.getElementById("about");
    const vision = document.getElementById("vision");
    const triggers: ScrollTrigger[] = [];

    if (hero && !reduce) {
      // 1) Hero → end of About: radial fail-open 0 → 1 (max as About finishes)
      triggers.push(
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          endTrigger: about ?? hero,
          end: about ? "bottom bottom" : "bottom top",
          scrub: 0.45,
          onUpdate: (self) => {
            const t = self.progress;
            state.targetScrollProgress = 1 - (1 - t) * (1 - t);
            // Always clear merge while on the hero→about open arc
            state.targetMerge = 0;
            if (t < 0.98) state.mergeProgress = Math.min(state.mergeProgress, 0.02);
          },
        }),
      );

      // 1b) About pin window: orbit path so copy on the left stays readable
      // Match ManifestoSection pin length so the mark clears text for the whole read.
      if (about) {
        triggers.push(
          ScrollTrigger.create({
            trigger: about,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 2.8)}`,
            scrub: 0.55,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const { x, y, s } = sampleAboutPath(self.progress);
              state.targetPathX = x;
              state.targetPathY = y;
              state.targetAboutScale = s;
            },
            onLeaveBack: () => {
              state.targetPathX = 0;
              state.targetPathY = 0;
              state.targetAboutScale = 1;
            },
          }),
        );
      }

      // 2) About exit → Vision: reassemble (open 1 → 0) + ease path home
      if (about && vision) {
        triggers.push(
          ScrollTrigger.create({
            trigger: about,
            start: "bottom bottom",
            endTrigger: vision,
            end: "top 65%",
            scrub: 0.55,
            onUpdate: (self) => {
              const t = self.progress;
              state.targetScrollProgress = Math.max(0, 1 - t * t);
              state.targetMerge = 0;
              const end = sampleAboutPath(1);
              state.targetPathX = end.x * (1 - t);
              state.targetPathY = end.y * (1 - t);
              state.targetAboutScale = end.s + (1 - end.s) * t;
            },
          }),
        );

        // 3) Across Focused vision / Measured execution: merge into cream bg
        triggers.push(
          ScrollTrigger.create({
            trigger: vision,
            start: "top 65%",
            end: "bottom top",
            scrub: 0.6,
            onUpdate: (self) => {
              state.targetScrollProgress = 0;
              state.targetMerge = self.progress;
              state.targetPathX = 0;
              state.targetPathY = 0;
              state.targetAboutScale = 1;
            },
          }),
        );
      } else if (about) {
        triggers.push(
          ScrollTrigger.create({
            trigger: about,
            start: "bottom center",
            end: "bottom top",
            scrub: 0.45,
            onUpdate: (self) => {
              state.targetScrollProgress = Math.max(0, 1 - self.progress);
              state.targetMerge = self.progress;
              state.targetPathX *= 1 - self.progress;
              state.targetPathY *= 1 - self.progress;
              state.targetAboutScale += (1 - state.targetAboutScale) * self.progress;
            },
          }),
        );
      }

      mount.style.opacity = "1";
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    const onMove = (e: PointerEvent) => {
      state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();

    const draw = () => {
      if (disposed) return;
      const t = clock.getElapsedTime();

      state.holding = blastRef.current;
      if (state.holding) {
        state.holdTime += 1 / 60;
        // Buzz → explode into agent particles
        if (state.holdTime < 0.55) {
          state.vibrateAmt = 1;
          state.clickBurst = 0;
        } else {
          state.vibrateAmt = Math.max(0.05, state.vibrateAmt * 0.88);
          state.clickBurst = Math.min(1, state.clickBurst + 0.048);
        }
      } else {
        state.holdTime = 0;
        state.vibrateAmt = Math.max(0, state.vibrateAmt - 0.12);
        state.clickBurst = Math.max(0, state.clickBurst - 0.035);
      }

      state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.12;
      state.mergeProgress += (state.targetMerge - state.mergeProgress) * 0.09;
      state.pathX += (state.targetPathX - state.pathX) * 0.14;
      state.pathY += (state.targetPathY - state.pathY) * 0.14;
      state.aboutScale += (state.targetAboutScale - state.aboutScale) * 0.12;
      if (state.introAmt > 0.001) state.introAmt *= 0.975;
      else state.introAmt = 0;

      const holdEnergy = state.scrollProgress < 0.12 ? state.clickBurst : 0;
      const p = Math.max(state.scrollProgress, holdEnergy * 0.35, state.introAmt);
      const m = state.mergeProgress;
      const boom = state.scrollProgress < 0.14 ? state.clickBurst : 0;
      const boomE = boom * boom * (3 - 2 * boom);

      // Phone: large mark in the mid band under copy (positive Y = up on screen)
      const vw = window.innerWidth;
      const compact = vw < 720;
      const tablet = vw >= 720 && vw < 960;
      const layoutY = compact ? 0.55 : tablet ? -0.35 : 0;
      const layoutScale = compact ? 1.15 : tablet ? 0.88 : 1;
      const camZ = compact ? 3.85 : tablet ? 5.35 : 5.2;
      const camY = compact ? -0.15 : tablet ? 0.22 : 0.12;

      // Gentle yaw — keep spinning unless fully exploded
      if (boomE < 0.85) {
        state.rotY += reduce ? 0 : 0.0028 * (1 - m * 0.7);
        const targetRotX = 0.12 + 0.14 * state.mouseY * (1 - m);
        const targetRotY = state.rotY + 0.16 * state.mouseX * (1 - m);
        group.rotation.x += (targetRotX - group.rotation.x) * 0.06;
        group.rotation.y += (targetRotY - group.rotation.y) * 0.06;
      }

      if (state.built) {
        const gVib = state.vibrateAmt * (1 - boomE * 0.4);
        const gx = Math.sin(t * 92) * 0.028 * gVib + Math.sin(t * 151) * 0.012 * gVib;
        const gy = Math.cos(t * 107) * 0.024 * gVib + Math.cos(t * 173) * 0.01 * gVib;
        group.position.x = state.pathX * (1 - m) + gx;
        group.position.y =
          state.baseY + layoutY + state.pathY * (1 - m) - m * 0.55 - p * 0.08 + gy;
        group.position.z = -m * 2.4;
        const bs = state.baseScale * state.aboutScale * layoutScale;
        const openScale = 1 + p * 0.1 + boomE * 0.15;
        const mergeScale = (1 - m * 0.42) * openScale;
        group.scale.set(bs * mergeScale, -bs * mergeScale, bs * mergeScale);
        group.visible = true;
      }

      // Sync agent cloud to mark position
      agentRoot.position.set(group.position.x, group.position.y, group.position.z + 0.2);
      agentRoot.visible = boomE > 0.05;

      state.vibratePhase += 3.6 + state.vibrateAmt * 4.2;
      const openAmt = 1.55;
      shards.forEach((e) => {
        const local = Math.max(0, Math.min(1, (p - e.delay) / Math.max(0.001, 1 - e.delay)));
        const eased = local * local * (3 - 2 * local);
        // Scroll = soft fail-open; hold boom = hard explode
        const scale = 1 + openAmt * eased * e.expandMul * (1 - boomE * 0.25);
        const idleX = 0.006 * Math.sin(0.35 * t + e.shapeIdx) * (1 - p) * (1 - m);
        const idleY = 0.005 * Math.cos(0.3 * t + e.shapeIdx) * (1 - p) * (1 - m);
        const vib = 0.155 * state.vibrateAmt * (1 - boomE * 0.7);
        const vx =
          Math.sin(state.vibratePhase * 1.7 + 28 * e.delay + e.shapeIdx * 2.1) * vib +
          Math.sin(state.vibratePhase * 3.1 + e.shapeIdx) * vib * 0.35;
        const vy =
          Math.cos(state.vibratePhase * 1.9 + e.shapeIdx * 0.9) * vib +
          Math.cos(state.vibratePhase * 2.7 + e.delay * 11) * vib * 0.3;
        const vz = Math.sin(state.vibratePhase * 2.2 + e.delay * 9) * vib * 0.75;

        const rx = e.homePos.x * (scale - 1) + idleX + vx + e.boomVel.x * boomE;
        const ry = e.homePos.y * (scale - 1) + idleY + vy + e.boomVel.y * boomE;
        const rz = e.homePos.z * (scale - 1) + e.depthLift * eased + vz + e.boomVel.z * boomE;

        e.mesh.position.set(rx, ry, rz);

        if (!e.isEdge) {
          e.mesh.rotation.x =
            e.homePos.y * 0.00008 * eased * (1 - boomE) + e.boomSpin.x * boomE;
          e.mesh.rotation.y =
            -e.homePos.x * 0.00006 * eased * (1 - boomE) + e.boomSpin.y * boomE;
          e.mesh.rotation.z = e.boomSpin.z * boomE;
          e.mesh.scale.set(1, 1, 1);
        } else {
          e.mesh.rotation.set(e.boomSpin.x * boomE, e.boomSpin.y * boomE, e.boomSpin.z * boomE);
          e.mesh.scale.set(1, 1, 1);
        }

        if (!e.isEdge && e.mesh instanceof THREE.Mesh) {
          const mat = e.mesh.material as THREE.MeshPhysicalMaterial;
          mat.emissiveIntensity =
            0.06 +
            p * 0.45 * (1 - m) +
            m * 0.02 +
            state.vibrateAmt * 0.55 * (1 - boomE) +
            boomE * 0.9;
          mat.opacity = Math.max(0.06, (1 - boomE * 0.55) * Math.max(0.08, 1 - m * 0.78));
          mat.transparent = true;
          mat.depthWrite = m < 0.55 && boomE < 0.75;
          mat.roughness = 0.22 + m * 0.55;
          mat.envMapIntensity = 1.35 * (1 - m * 0.85) + boomE * 0.4;
          warm.intensity =
            1.0 +
            p * 2.8 * (1 - m) +
            state.vibrateAmt * 1.6 * (1 - boomE) +
            boomE * 3.2;
        }
      });

      // —— Agent particles (nodes + sparks) ——
      agents.forEach((a, i) => {
        const live = boomE > 0.08;
        a.mesh.visible = live;
        if (!live) return;
        const reveal = Math.max(0, Math.min(1, (boomE - 0.08) / 0.4));
        const flight = boomE;
        const ox =
          a.seed.x +
          a.vel.x * flight * 0.55 +
          Math.sin(t * 1.4 + a.phase) * 0.12 * reveal;
        const oy =
          a.seed.y +
          a.vel.y * flight * 0.55 +
          Math.cos(t * 1.1 + a.phase * 1.3) * 0.1 * reveal;
        const oz =
          a.seed.z +
          a.vel.z * flight * 0.45 +
          Math.sin(t * 0.9 + i) * 0.08 * reveal;
        a.mesh.position.set(ox, oy, oz);
        a.mesh.rotation.x += a.spin.x * 0.016;
        a.mesh.rotation.y += a.spin.y * 0.016;
        a.mesh.rotation.z += a.spin.z * 0.016;
        const pop = a.size * (0.55 + reveal * 0.7 + Math.sin(t * 3 + a.phase) * 0.08);
        a.mesh.scale.setScalar(pop);
        const mat = a.mesh.material as THREE.MeshPhysicalMaterial;
        mat.opacity = 0.15 + reveal * 0.75;
        mat.emissiveIntensity = 0.25 + reveal * 0.85 + state.vibrateAmt * 0.2;
      });

      // —— AI term labels (OpenAI, LLM, …) — billboards, readable ——
      terms.forEach((term, i) => {
        const live = boomE > 0.12;
        term.mesh.visible = live;
        if (!live) return;
        const reveal = Math.max(0, Math.min(1, (boomE - 0.1 - (i % 6) * 0.02) / 0.45));
        const revE = reveal * reveal * (3 - 2 * reveal);
        const flight = boomE;
        const ox =
          term.seed.x +
          term.vel.x * flight * 0.72 +
          Math.sin(t * 0.9 + term.phase) * 0.06 * revE;
        const oy =
          term.seed.y +
          term.vel.y * flight * 0.65 +
          Math.cos(t * 1.15 + term.phase) * 0.05 * revE;
        const oz =
          term.seed.z +
          term.vel.z * flight * 0.55 +
          Math.sin(t * 0.7 + i) * 0.04 * revE;
        term.mesh.position.set(ox, oy, oz);
        // Always face camera so terms stay readable
        term.mesh.quaternion.copy(camera.quaternion);
        const pop = (0.75 + revE * 0.35) * screenMul;
        term.mesh.scale.set(pop, pop, pop);
        const mat = term.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = revE * 0.95;
      });

      // Sparks
      sparkMat.opacity = boomE > 0.12 ? Math.min(0.95, boomE * 1.1) : 0;
      if (boomE > 0.1) {
        for (let i = 0; i < sparkCount; i += 1) {
          const v = sparkVel[i];
          const u = boomE;
          sparkPos[i * 3] = v.x * u * 0.7 + Math.sin(t * 2.2 + i) * 0.05;
          sparkPos[i * 3 + 1] = v.y * u * 0.7 + Math.cos(t * 1.8 + i * 0.7) * 0.05;
          sparkPos[i * 3 + 2] = v.z * u * 0.55;
        }
        sparkGeo.attributes.position.needsUpdate = true;
      }

      edgeMat.opacity = 0.22 * (1 - Math.min(1, p * 1.35)) * (1 - m) * (1 - boomE * 0.7);
      floor.material.opacity = 0.45 * (1 - Math.min(1, p * 0.85)) * (1 - m) * (1 - boomE * 0.5);
      cool.position.set(3.5 * Math.sin(0.5 * t), 1.8, 2.5 + Math.cos(0.4 * t));
      cool.intensity = 0.45 * (1 - m) + boomE * 0.8;

      // Soft merge into cream behind Focused vision — never kill hero visibility
      const onAbout = Math.abs(state.pathX) + Math.abs(state.pathY) > 0.04 || state.targetPathX !== 0;
      if (m < 0.02) {
        mount.style.opacity = "1";
        // Above about (z4) while parked on the right empty space
        mount.style.zIndex = onAbout ? "6" : "1";
      } else {
        mount.style.opacity = String(Math.max(0.04, 1 - m * 0.9));
        mount.style.zIndex = "0";
      }

      const ui = document.querySelector(".cine-hero-ui") as HTMLElement | null;
      if (ui) {
        // Only fade hero UI from scroll scatter, not merge leftovers
        const fade = 1 - Math.min(1, Math.max(0, (state.scrollProgress - 0.02) / 0.42));
        ui.style.opacity = fade.toFixed(3);
      }

      camera.position.z = camZ + p * 0.55 + m * 1.6;
      camera.position.y = camY - p * 0.06 - m * 0.2;
      // Micro camera shake during haptic buzz
      if (state.vibrateAmt > 0.05 && state.clickBurst < 0.4) {
        const cAmp = 0.018 * state.vibrateAmt * (1 - state.clickBurst);
        camera.position.x = Math.sin(t * 88) * cAmp;
        camera.position.y += Math.cos(t * 97) * cAmp * 0.85;
      } else {
        camera.position.x *= 0.85;
      }
      if (state.built) {
        mount.dataset.open = p.toFixed(3);
        mount.dataset.merge = m.toFixed(3);
      }
      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = Math.max(1, mount.clientWidth || window.innerWidth);
      h = Math.max(1, mount.clientHeight || window.innerHeight);
      screenMul = termScreenMul();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    const refreshT = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      disposed = true;
      window.clearTimeout(refreshT);
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      const ui = document.querySelector(".cine-hero-ui") as HTMLElement | null;
      if (ui) ui.style.opacity = "";
      mount.style.opacity = "";
      mount.style.zIndex = "";
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      cubeRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [ready]);

  if (!ready) return null;

  return createPortal(
    <div
      aria-hidden
      className={className}
      id="lyzr-symbol-canvas-wrap"
      ref={mountRef}
    />,
    document.body,
  );
}
