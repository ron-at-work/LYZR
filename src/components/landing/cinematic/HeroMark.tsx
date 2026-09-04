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
  homePos: THREE.Vector3;
  explodeDir: THREE.Vector3;
  spinAxis: THREE.Vector3;
  spinSpeed: number;
  delay: number;
  shapeIdx: number;
  isEdge?: boolean;
};

/**
 * 3D Lyzr mark only (inner glyph — no plate/squircle).
 * Warm-white theme: dark ink glass that shatters on scroll / hold.
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

    const pushShard = (
      mesh: THREE.Object3D,
      shapeIdx: number,
      dir: THREE.Vector3,
      isEdge = false,
    ) => {
      shards.push({
        mesh,
        homePos: new THREE.Vector3(0, 0, 0),
        explodeDir: dir.clone().normalize(),
        spinAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize(),
        spinSpeed: isEdge ? 0 : (Math.random() - 0.5) * 0.9,
        delay: isEdge ? 0 : Math.random() * 0.2,
        shapeIdx,
        isEdge,
      });
    };

    const shatterExtruded = (geo: THREE.ExtrudeGeometry, shapeIdx: number) => {
      geos.push(geo);
      geo.computeBoundingBox();
      const box = geo.boundingBox!;
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const pos = geo.attributes.position.array as Float32Array;
      const nor = geo.attributes.normal.array as Float32Array;
      const triCount = pos.length / 9;
      const gx = 3;
      const gy = 4;
      const gz = 2;
      type Bucket = { pos: number[]; nor: number[]; cx: number; cy: number; cz: number; n: number };
      const buckets = new Map<string, Bucket>();

      for (let i = 0; i < triCount; i++) {
        const t = 9 * i;
        const tx = (pos[t] + pos[t + 3] + pos[t + 6]) / 3;
        const ty = (pos[t + 1] + pos[t + 4] + pos[t + 7]) / 3;
        const tz = (pos[t + 2] + pos[t + 5] + pos[t + 8]) / 3;
        const ix = Math.min(gx - 1, Math.max(0, Math.floor(((tx - box.min.x) / (size.x || 1)) * gx)));
        const iy = Math.min(gy - 1, Math.max(0, Math.floor(((ty - box.min.y) / (size.y || 1)) * gy)));
        const iz = Math.min(gz - 1, Math.max(0, Math.floor(((tz - box.min.z) / (size.z || 1)) * gz)));
        const key = `${ix},${iy},${iz}`;
        let b = buckets.get(key);
        if (!b) {
          b = { pos: [], nor: [], cx: 0, cy: 0, cz: 0, n: 0 };
          buckets.set(key, b);
        }
        for (let k = 0; k < 9; k++) {
          b.pos.push(pos[t + k]);
          b.nor.push(nor[t + k]);
        }
        b.cx += tx;
        b.cy += ty;
        b.cz += tz;
        b.n += 1;
      }

      buckets.forEach((b) => {
        if (!b.n) return;
        b.cx /= b.n;
        b.cy /= b.n;
        b.cz /= b.n;
        const shardGeo = new THREE.BufferGeometry();
        shardGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(b.pos), 3));
        shardGeo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(b.nor), 3));
        geos.push(shardGeo);
        const mat = inkMat.clone();
        mats.push(mat);
        const mesh = new THREE.Mesh(shardGeo, mat);
        group.add(mesh);

        const mx = b.cx - center.x;
        const my = b.cy - center.y;
        const mz = b.cz - center.z;
        const len = Math.hypot(mx, my, mz) || 1;
        pushShard(
          mesh,
          shapeIdx,
          new THREE.Vector3(
            mx / len + (Math.random() - 0.5) * 0.45,
            // Bias downward so pieces feel like they fall apart while scrolling down
            my / len - 0.35 - Math.random() * 0.55,
            mz / len + 0.45 + Math.random() * 0.5,
          ),
        );
      });

      const edges = new THREE.EdgesGeometry(geo, 18);
      geos.push(edges);
      const edge = new THREE.LineSegments(edges, edgeMat);
      group.add(edge);
      pushShard(edge, shapeIdx, new THREE.Vector3(), true);
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
            shatterExtruded(new THREE.ExtrudeGeometry(shape, extrude), shapeIdx++);
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
          }
        });

        shards.forEach((s) => {
          s.homePos.set(0, 0, 0);
          if (s.isEdge) {
            s.explodeDir.set(0, 0, 0);
            return;
          }
          const geo = (s.mesh as THREE.Mesh).geometry;
          geo.computeBoundingBox();
          const c = new THREE.Vector3();
          geo.boundingBox!.getCenter(c);
          const len = c.length() || 1;
          s.explodeDir
            .set(
              c.x / len + (Math.random() - 0.5) * 0.4,
              c.y / len - 0.35 - Math.random() * 0.5,
              c.z / len + 0.4 + Math.random() * 0.45,
            )
            .normalize();
        });

        const s = 2.55 / Math.max(size.x, size.y, 0.001);
        group.scale.set(s, -s, s);
        // Pivot = visual center → rotate in place
        group.position.set(0, 0.08, 0);
        state.baseY = 0.08;

        cubeCamera.update(renderer, scene);
        ScrollTrigger.refresh();
      },
      undefined,
      () => console.warn("glyph svg failed"),
    );

    const state = {
      scrollProgress: 0,
      targetScrollProgress: 0,
      introAmt: reduce ? 0 : 1,
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
    };

    const hero = document.getElementById("top");
    const about = document.getElementById("about");
    let st: ScrollTrigger | null = null;
    let fadeSt: ScrollTrigger | null = null;
    if (hero && !reduce) {
      // Stay mostly assembled through About so copy can sit on the cream + mark scene.
      // Soft scatter only near the end of About, then fade out.
      st = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        endTrigger: about ?? hero,
        end: about ? "bottom top" : "bottom top",
        scrub: 0.85,
        onUpdate: (self) => {
          const raw = self.progress;
          // Hold form until ~62% of hero→about, then scatter
          state.targetScrollProgress =
            raw < 0.62 ? 0 : Math.min(1, (raw - 0.62) / 0.38);
        },
      });

      if (about && mount) {
        mount.style.opacity = "1";
        fadeSt = ScrollTrigger.create({
          trigger: about,
          start: "center top",
          end: "bottom top",
          scrub: 0.55,
          onUpdate: (self) => {
            mount.style.opacity = String(1 - self.progress * 0.92);
          },
        });
      }
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

      state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.06;
      if (state.introAmt > 0.001) state.introAmt *= 0.975;
      else state.introAmt = 0;

      const holdEnergy = state.scrollProgress < 0.12 ? state.clickBurst : 0;
      const p = Math.max(state.scrollProgress, holdEnergy, state.introAmt);

      // Gentle yaw around the mark's own center (not orbit)
      state.rotY += reduce ? 0 : 0.0028;
      const targetRotX = 0.12 + 0.14 * state.mouseY;
      const targetRotY = state.rotY + 0.16 * state.mouseX;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.06;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.06;

      // Soft settle downward with scatter (follows the page exit)
      group.position.y = state.baseY + p * -0.85;

      state.vibratePhase += 1.1;
      shards.forEach((e) => {
        const local = Math.max(0, p - e.delay);
        const dist = 3.4 * local;
        const a = e.shapeIdx * ((2 * Math.PI) / 4);
        const idleX = 0.008 * Math.sin(0.4 * t + a) * (1 - p);
        const idleY = 0.006 * Math.cos(0.35 * t + a) * (1 - p);
        const vib = 0.014 * state.vibrateAmt * (1 - state.clickBurst);
        const vx = Math.sin(state.vibratePhase + 18 * e.delay) * vib;
        const vy = Math.cos(1.3 * state.vibratePhase + e.shapeIdx) * vib;

        e.mesh.position.set(
          e.homePos.x + e.explodeDir.x * dist + idleX + vx,
          e.homePos.y + e.explodeDir.y * dist + idleY + vy,
          e.homePos.z + e.explodeDir.z * dist,
        );
        if (!e.isEdge) {
          e.mesh.rotation.x = e.spinAxis.x * e.spinSpeed * local * Math.PI;
          e.mesh.rotation.y = e.spinAxis.y * e.spinSpeed * local * Math.PI;
          e.mesh.rotation.z = e.spinAxis.z * e.spinSpeed * local * Math.PI;
        }
        if (!e.isEdge && e.mesh instanceof THREE.Mesh) {
          const mat = e.mesh.material as THREE.MeshPhysicalMaterial;
          mat.emissiveIntensity = 0.06 + p * 0.55;
          warm.intensity = 1.0 + p * 4.2;
        }
      });

      floor.material.opacity = 0.45 * (1 - Math.min(1, p * 1.2));
      cool.position.set(3.5 * Math.sin(0.5 * t), 1.8, 2.5 + Math.cos(0.4 * t));

      const ui = document.querySelector(".cine-hero-ui") as HTMLElement | null;
      if (ui) {
        // Keep copy readable while mark is still assembled; fade on exit scatter
        const fade = 1 - Math.min(1, Math.max(0, (p - 0.05) / 0.55));
        ui.style.opacity = fade.toFixed(3);
      }

      camera.position.z = 5.2 + p * 0.95;
      camera.position.y = 0.12 - p * 0.12;
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
      st?.kill();
      fadeSt?.kill();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      const ui = document.querySelector(".cine-hero-ui") as HTMLElement | null;
      if (ui) ui.style.opacity = "";
      mount.style.opacity = "";
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
