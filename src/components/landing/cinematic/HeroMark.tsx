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
  isEdge?: boolean;
};

/**
 * 3D Lyzr mark only (inner glyph — no plate/squircle).
 * Warm-white theme: dark ink glass that expands on scroll like Trionn —
 * silhouette stays, gaps open (radial fail-open), no explode tumble.
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
    const shards: Shard[] = [];
    const geos: THREE.BufferGeometry[] = [floorGeo];
    const mats: THREE.Material[] = [inkMat, edgeMat, floorMat];

    const pushShard = (mesh: THREE.Object3D, shapeIdx: number, isEdge = false) => {
      shards.push({
        mesh,
        homePos: new THREE.Vector3(0, 0, 0),
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
      // About path: right → up-center → right → down-center (world units)
      pathX: 0,
      pathY: 0,
      targetPathX: 0,
      targetPathY: 0,
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

    /** Piecewise path while About is on screen — clears the left copy. */
    const sampleAboutPath = (t: number) => {
      const pts = [
        { t: 0, x: 0.85, y: 0 }, // clear copy as soon as About pins
        { t: 0.22, x: 1.45, y: 0.08 }, // right shift
        { t: 0.45, x: 0.25, y: 0.9 }, // up center
        { t: 0.7, x: 1.5, y: 0.12 }, // right again
        { t: 1, x: 0.3, y: -0.95 }, // down center
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

        const s = 2.55 / Math.max(size.x, size.y, 0.001);
        state.baseScale = s;
        state.built = true;
        group.scale.set(s, -s, s);
        // Pivot = visual center → rotate in place
        group.position.set(0, 0.08, 0);
        state.baseY = 0.08;
        mount.style.opacity = "1";
        mount.style.zIndex = "3";
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
            end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
            scrub: 0.55,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const { x, y } = sampleAboutPath(self.progress);
              state.targetPathX = x;
              state.targetPathY = y;
            },
            onLeaveBack: () => {
              state.targetPathX = 0;
              state.targetPathY = 0;
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
        state.vibrateAmt = 1;
        if (state.holdTime < 0.5) state.clickBurst = 0;
        else {
          state.vibrateAmt *= 0.88;
          state.clickBurst = Math.min(1, state.clickBurst + 0.02);
        }
      } else {
        state.holdTime = 0;
        state.vibrateAmt = Math.max(0, state.vibrateAmt - 0.08);
        state.clickBurst = Math.max(0, state.clickBurst - 0.025);
      }

      state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.12;
      state.mergeProgress += (state.targetMerge - state.mergeProgress) * 0.09;
      state.pathX += (state.targetPathX - state.pathX) * 0.14;
      state.pathY += (state.targetPathY - state.pathY) * 0.14;
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

      // Soft settle + About orbit path (right → up → right → down)
      if (state.built) {
        group.position.x = state.pathX * (1 - m);
        group.position.y = state.baseY + state.pathY * (1 - m) - m * 0.55 - p * 0.08;
        group.position.z = -m * 2.4;
        const bs = state.baseScale;
        // Slight overall grow while open (Trionn “fails open”)
        const openScale = 1 + p * 0.12;
        const mergeScale = (1 - m * 0.42) * openScale;
        group.scale.set(bs * mergeScale, -bs * mergeScale, bs * mergeScale);
      }

      state.vibratePhase += 1.1;
      // How far the silhouette opens (1 = assembled, ~2.6 = fully failed-open)
      const openAmt = 1.55;
      shards.forEach((e) => {
        const local = Math.max(0, Math.min(1, (p - e.delay) / Math.max(0.001, 1 - e.delay)));
        // Smoothstep for premium ease
        const eased = local * local * (3 - 2 * local);
        const scale = 1 + openAmt * eased * e.expandMul;
        const idleX = 0.006 * Math.sin(0.35 * t + e.shapeIdx) * (1 - p) * (1 - m);
        const idleY = 0.005 * Math.cos(0.3 * t + e.shapeIdx) * (1 - p) * (1 - m);
        const vib = 0.01 * state.vibrateAmt * (1 - state.clickBurst);
        const vx = Math.sin(state.vibratePhase + 18 * e.delay) * vib;
        const vy = Math.cos(1.3 * state.vibratePhase + e.shapeIdx) * vib;

        // Radial expand: visualCentroid = homePos * scale
        e.mesh.position.set(
          e.homePos.x * (scale - 1) + idleX + vx,
          e.homePos.y * (scale - 1) + idleY + vy,
          e.homePos.z * (scale - 1) + e.depthLift * eased,
        );
        // Keep plates oriented — only a whisper of tilt so it doesn’t tumble
        if (!e.isEdge) {
          e.mesh.rotation.x = e.homePos.y * 0.00008 * eased;
          e.mesh.rotation.y = -e.homePos.x * 0.00006 * eased;
          e.mesh.rotation.z = 0;
        }
        if (!e.isEdge && e.mesh instanceof THREE.Mesh) {
          const mat = e.mesh.material as THREE.MeshPhysicalMaterial;
          mat.emissiveIntensity = 0.06 + p * 0.45 * (1 - m) + m * 0.02;
          mat.opacity = Math.max(0.08, 1 - m * 0.78);
          mat.transparent = m > 0.02;
          mat.depthWrite = m < 0.55;
          mat.roughness = 0.22 + m * 0.55;
          mat.envMapIntensity = 1.35 * (1 - m * 0.85);
          warm.intensity = 1.0 + p * 2.8 * (1 - m);
        }
      });

      edgeMat.opacity = 0.22 * (1 - Math.min(1, p * 1.35)) * (1 - m);
      floor.material.opacity = 0.45 * (1 - Math.min(1, p * 0.85)) * (1 - m);
      cool.position.set(3.5 * Math.sin(0.5 * t), 1.8, 2.5 + Math.cos(0.4 * t));
      cool.intensity = 0.45 * (1 - m);

      // Soft merge into cream behind Focused vision — never kill hero visibility
      if (m < 0.02) {
        mount.style.opacity = "1";
        mount.style.zIndex = "3";
      } else {
        mount.style.opacity = String(Math.max(0.04, 1 - m * 0.9));
        mount.style.zIndex = "1";
      }

      const ui = document.querySelector(".cine-hero-ui") as HTMLElement | null;
      if (ui) {
        // Only fade hero UI from scroll scatter, not merge leftovers
        const fade = 1 - Math.min(1, Math.max(0, (state.scrollProgress - 0.02) / 0.42));
        ui.style.opacity = fade.toFixed(3);
      }

      camera.position.z = 5.2 + p * 0.55 + m * 1.6;
      camera.position.y = 0.12 - p * 0.06 - m * 0.2;
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
