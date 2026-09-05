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
  /** Where this plate flies while reforming into A / I. */
  aiPos: THREE.Vector3;
  /** Extra radial push multiplier (slight depth variance, Trionn-style). */
  expandMul: number;
  /** Tiny z lift so plates separate in depth without tumbling. */
  depthLift: number;
  delay: number;
  shapeIdx: number;
  isEdge?: boolean;
};

type WordLetter = {
  mesh: THREE.Mesh;
  edge: THREE.LineSegments;
  homeX: number;
};

/**
 * 3D Lyzr mark only (inner glyph — no plate/squircle).
 * Warm-white theme: dark glass that expands on scroll like Trionn —
 * silhouette stays, gaps open (radial fail-open), no explode tumble.
 * Hold → haptic buzz → same mark reforms into “LYZR”.
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
    const wordRoot = new THREE.Group();
    group.add(wordRoot);
    const shards: Shard[] = [];
    const wordLetters: WordLetter[] = [];
    const geos: THREE.BufferGeometry[] = [floorGeo];
    const mats: THREE.Material[] = [inkMat, edgeMat, floorMat];

    /** Blocky glyph letters — same stepped language as the 3D mark. */
    const shapeL = () => {
      const s = new THREE.Shape();
      s.moveTo(0, 0);
      s.lineTo(56, 0);
      s.lineTo(56, 16);
      s.lineTo(20, 16);
      s.lineTo(20, 112);
      s.lineTo(0, 112);
      s.closePath();
      return s;
    };
    const shapeY = () => {
      const s = new THREE.Shape();
      s.moveTo(0, 112);
      s.lineTo(18, 112);
      s.lineTo(28, 72);
      s.lineTo(38, 112);
      s.lineTo(56, 112);
      s.lineTo(36, 56);
      s.lineTo(36, 0);
      s.lineTo(20, 0);
      s.lineTo(20, 56);
      s.closePath();
      return s;
    };
    const shapeZ = () => {
      const s = new THREE.Shape();
      s.moveTo(0, 96);
      s.lineTo(0, 112);
      s.lineTo(56, 112);
      s.lineTo(56, 96);
      s.lineTo(24, 96);
      s.lineTo(56, 16);
      s.lineTo(56, 0);
      s.lineTo(0, 0);
      s.lineTo(0, 16);
      s.lineTo(32, 16);
      s.closePath();
      return s;
    };
    const shapeR = () => {
      const s = new THREE.Shape();
      s.moveTo(0, 0);
      s.lineTo(18, 0);
      s.lineTo(18, 48);
      s.lineTo(32, 48);
      s.lineTo(48, 0);
      s.lineTo(56, 0);
      s.lineTo(38, 52);
      s.lineTo(44, 56);
      s.lineTo(48, 68);
      s.lineTo(48, 96);
      s.lineTo(44, 108);
      s.lineTo(32, 112);
      s.lineTo(0, 112);
      s.closePath();
      const hole = new THREE.Path();
      hole.moveTo(18, 64);
      hole.lineTo(32, 64);
      hole.lineTo(34, 72);
      hole.lineTo(34, 92);
      hole.lineTo(30, 96);
      hole.lineTo(18, 96);
      hole.closePath();
      s.holes.push(hole);
      return s;
    };

    const pushShard = (mesh: THREE.Object3D, shapeIdx: number, isEdge = false) => {
      shards.push({
        mesh,
        homePos: new THREE.Vector3(0, 0, 0),
        aiPos: new THREE.Vector3(0, 0, 0),
        expandMul: isEdge ? 1 : 0.96 + Math.random() * 0.08,
        depthLift: isEdge ? 0 : (Math.random() - 0.5) * 0.22,
        delay: isEdge ? 0 : shapeIdx * 0.012,
        shapeIdx,
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
            return;
          }
          const r = Math.hypot(c.x, c.y);
          // Outer plates open a touch more than the core — still one silhouette
          s.expandMul = 0.96 + Math.min(0.18, r * 0.001) + Math.random() * 0.04;
          s.depthLift = (Math.random() - 0.5) * 0.2;
        });

        // Same mark reforms into “LYZR” — same ink, same group, no hang/strings.
        // Counter the group's Y-flip so letters read upright.
        wordRoot.scale.set(1, -1, 1);

        const buildLetter = (shape: THREE.Shape, homeX: number) => {
          const extrude: THREE.ExtrudeGeometryOptions = {
            depth: 42,
            bevelEnabled: true,
            bevelThickness: 5,
            bevelSize: 4,
            bevelSegments: 3,
            curveSegments: 4,
          };
          const geo = new THREE.ExtrudeGeometry(shape, extrude);
          geos.push(geo);
          geo.computeBoundingBox();
          geo.computeVertexNormals();
          const c = new THREE.Vector3();
          const sz = new THREE.Vector3();
          geo.boundingBox!.getCenter(c);
          geo.boundingBox!.getSize(sz);
          geo.translate(-c.x, -c.y, -c.z);
          const fit = (size.y * 0.38) / Math.max(sz.y, 1);
          geo.scale(fit, fit, fit);

          const mat = inkMat.clone();
          mat.transparent = true;
          mat.opacity = 0;
          mat.emissiveIntensity = 0.08;
          mats.push(mat);
          const mesh = new THREE.Mesh(geo, mat);
          mesh.frustumCulled = false;
          mesh.visible = false;
          mesh.position.set(homeX, 0, 8);
          wordRoot.add(mesh);

          const edges = new THREE.EdgesGeometry(geo, 22);
          geos.push(edges);
          const edge = new THREE.LineSegments(edges, edgeMat.clone());
          mats.push(edge.material as THREE.Material);
          (edge.material as THREE.LineBasicMaterial).transparent = true;
          (edge.material as THREE.LineBasicMaterial).opacity = 0;
          edge.visible = false;
          edge.frustumCulled = false;
          edge.position.copy(mesh.position);
          wordRoot.add(edge);

          wordLetters.push({ mesh, edge, homeX });
        };

        // Y-scale mirrors X — +X reads left on screen. Lay out L→Y→Z→R left to right.
        const gap = size.x * 0.2;
        const xs = [gap * 1.55, gap * 0.52, -gap * 0.52, -gap * 1.55];
        buildLetter(shapeL(), xs[0]);
        buildLetter(shapeY(), xs[1]);
        buildLetter(shapeZ(), xs[2]);
        buildLetter(shapeR(), xs[3]);

        // Plates fly toward nearest letter slot while LYZR fades in
        const plates = shards.filter((s) => !s.isEdge);
        plates.sort((a, b) => a.homePos.x - b.homePos.x);
        plates.forEach((s, i) => {
          const slot = xs[Math.min(xs.length - 1, Math.floor((i / Math.max(1, plates.length)) * xs.length))];
          s.aiPos.set(slot - s.homePos.x, -s.homePos.y, 16 + i * 5);
          const edge = shards.find((e) => e.isEdge && e.shapeIdx === s.shapeIdx);
          if (edge) edge.aiPos.copy(s.aiPos);
        });

        const s = 2.55 / Math.max(size.x, size.y, 0.001);
        state.baseScale = s;
        state.built = true;
        group.scale.set(s, -s, s);
        // Pivot = visual center → rotate in place
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
        // Hard haptic buzz first — then logo morphs into A / I
        if (state.holdTime < 0.78) {
          state.vibrateAmt = 1;
          state.clickBurst = 0;
        } else {
          state.vibrateAmt = Math.max(0.08, state.vibrateAmt * 0.86);
          state.clickBurst = Math.min(1, state.clickBurst + 0.055);
        }
      } else {
        state.holdTime = 0;
        state.vibrateAmt = Math.max(0, state.vibrateAmt - 0.12);
        state.clickBurst = Math.max(0, state.clickBurst - 0.03);
      }

      state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.12;
      state.mergeProgress += (state.targetMerge - state.mergeProgress) * 0.09;
      state.pathX += (state.targetPathX - state.pathX) * 0.14;
      state.pathY += (state.targetPathY - state.pathY) * 0.14;
      state.aboutScale += (state.targetAboutScale - state.aboutScale) * 0.12;
      if (state.introAmt > 0.001) state.introAmt *= 0.975;
      else state.introAmt = 0;

      const holdEnergy = state.scrollProgress < 0.12 ? state.clickBurst : 0;
      const p = Math.max(state.scrollProgress, holdEnergy, state.introAmt);
      const m = state.mergeProgress;

      // Gentle yaw around the mark's own center (not orbit)
      state.rotY += reduce ? 0 : 0.0028 * (1 - m * 0.7);
      const targetRotX = 0.12 + 0.14 * state.mouseY * (1 - m);
      const targetRotY = state.rotY + 0.16 * state.mouseX * (1 - m);
      group.rotation.x += (targetRotX - group.rotation.x) * 0.06;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.06;

      // Soft settle + About orbit path (right → hold → center → down)
      // clickBurst = mark reforming into A / I (after buzz)
      const morph = state.scrollProgress < 0.12 ? state.clickBurst : 0;
      const morphE = morph * morph * (3 - 2 * morph);

      if (state.built) {
        // Whole-mark haptic shake while buzzing
        const gVib = state.vibrateAmt * (1 - morphE * 0.5);
        const gx = Math.sin(t * 92) * 0.028 * gVib + Math.sin(t * 151) * 0.012 * gVib;
        const gy = Math.cos(t * 107) * 0.024 * gVib + Math.cos(t * 173) * 0.01 * gVib;
        // Soft settle once reformed into LYZR
        const hang =
          morphE *
          (Math.sin(t * 2.4) * 0.008 + Math.sin(t * 3.1 + 1.2) * 0.005);
        group.position.x = state.pathX * (1 - m) + gx + hang;
        group.position.y = state.baseY + state.pathY * (1 - m) - m * 0.55 - p * 0.08 + gy;
        group.position.z = -m * 2.4;
        const bs = state.baseScale * state.aboutScale;
        // Slight overall grow while open / morphing into LYZR
        const openScale = 1 + p * 0.1 + morphE * 0.06;
        const mergeScale = (1 - m * 0.42) * openScale;
        group.scale.set(bs * mergeScale, -bs * mergeScale, bs * mergeScale);
        group.rotation.z += (hang * 0.5 - group.rotation.z) * 0.08;
        group.visible = true;
      }

      // High-freq chatter = haptic feel
      state.vibratePhase += 3.6 + state.vibrateAmt * 4.2;
      const openAmt = 1.55;
      shards.forEach((e) => {
        const local = Math.max(0, Math.min(1, (p - e.delay) / Math.max(0.001, 1 - e.delay)));
        const eased = local * local * (3 - 2 * local);
        // Open less while reforming into LYZR
        const scale = 1 + openAmt * eased * e.expandMul * (1 - morphE * 0.75);
        const idleX = 0.006 * Math.sin(0.35 * t + e.shapeIdx) * (1 - p) * (1 - m);
        const idleY = 0.005 * Math.cos(0.3 * t + e.shapeIdx) * (1 - p) * (1 - m);
        const vib = 0.155 * state.vibrateAmt * (1 - morphE * 0.85);
        const vx =
          Math.sin(state.vibratePhase * 1.7 + 28 * e.delay + e.shapeIdx * 2.1) * vib +
          Math.sin(state.vibratePhase * 3.1 + e.shapeIdx) * vib * 0.35;
        const vy =
          Math.cos(state.vibratePhase * 1.9 + e.shapeIdx * 0.9) * vib +
          Math.cos(state.vibratePhase * 2.7 + e.delay * 11) * vib * 0.3;
        const vz = Math.sin(state.vibratePhase * 2.2 + e.delay * 9) * vib * 0.75;

        const rx = e.homePos.x * (scale - 1) + idleX + vx;
        const ry = e.homePos.y * (scale - 1) + idleY + vy;
        const rz = e.homePos.z * (scale - 1) + e.depthLift * eased + vz;

        // Plates pull into A / I slots, then dissolve into letter forms
        e.mesh.position.set(
          rx * (1 - morphE) + e.aiPos.x * morphE,
          ry * (1 - morphE) + e.aiPos.y * morphE,
          rz * (1 - morphE) + e.aiPos.z * morphE,
        );

        if (!e.isEdge) {
          e.mesh.rotation.x = e.homePos.y * 0.00008 * eased * (1 - morphE);
          e.mesh.rotation.y = -e.homePos.x * 0.00006 * eased * (1 - morphE);
          e.mesh.rotation.z = 0;
          const shrink = 1 - morphE * 0.92;
          e.mesh.scale.set(shrink, shrink, shrink);
        } else {
          e.mesh.rotation.set(0, 0, 0);
          e.mesh.scale.set(1 - morphE, 1 - morphE, 1 - morphE);
        }

        if (!e.isEdge && e.mesh instanceof THREE.Mesh) {
          const mat = e.mesh.material as THREE.MeshPhysicalMaterial;
          mat.emissiveIntensity =
            0.06 +
            p * 0.45 * (1 - m) +
            m * 0.02 +
            state.vibrateAmt * 0.55 * (1 - morphE) +
            morphE * 0.4;
          // Dissolve plates as LYZR takes over
          mat.opacity = Math.max(0, (1 - morphE * 1.05) * Math.max(0.08, 1 - m * 0.78));
          mat.transparent = true;
          mat.depthWrite = m < 0.55 && morphE < 0.85;
          mat.roughness = 0.22 + m * 0.55;
          mat.envMapIntensity = 1.35 * (1 - m * 0.85);
          warm.intensity =
            1.0 +
            p * 2.8 * (1 - m) +
            state.vibrateAmt * 1.6 * (1 - morphE) +
            morphE * 2.0;
        }
      });

      // Reformed mark = LYZR in the same 3D block form (centered, no hang)
      wordLetters.forEach((letter, i) => {
        const show = morphE > 0.08;
        letter.mesh.visible = show;
        letter.edge.visible = show;
        if (!show) return;
        const mat = letter.mesh.material as THREE.MeshPhysicalMaterial;
        const eMat = letter.edge.material as THREE.LineBasicMaterial;
        const reveal = Math.max(0, Math.min(1, (morphE - 0.08 - i * 0.04) / 0.5));
        const revE = reveal * reveal * (3 - 2 * reveal);
        mat.opacity = revE;
        mat.emissiveIntensity = 0.1 + revE * 0.65 + state.vibrateAmt * 0.2;
        eMat.opacity = revE * 0.3;
        const pop = 0.82 + revE * 0.18;
        const buzz =
          Math.sin(t * 18 + i) * 0.008 * state.vibrateAmt * (1 - revE * 0.5);
        letter.mesh.position.set(letter.homeX + buzz * 20, buzz * 12, 8);
        letter.mesh.rotation.z = buzz * 0.4;
        letter.mesh.scale.set(pop, pop, pop);
        letter.edge.position.copy(letter.mesh.position);
        letter.edge.rotation.copy(letter.mesh.rotation);
        letter.edge.scale.copy(letter.mesh.scale);
      });

      edgeMat.opacity = 0.22 * (1 - Math.min(1, p * 1.35)) * (1 - m) * (1 - morphE);
      floor.material.opacity = 0.45 * (1 - Math.min(1, p * 0.85)) * (1 - m) * (1 - morphE * 0.6);
      cool.position.set(3.5 * Math.sin(0.5 * t), 1.8, 2.5 + Math.cos(0.4 * t));
      cool.intensity = 0.45 * (1 - m);

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

      camera.position.z = 5.2 + p * 0.55 + m * 1.6;
      camera.position.y = 0.12 - p * 0.06 - m * 0.2;
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
