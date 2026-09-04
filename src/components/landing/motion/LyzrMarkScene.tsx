'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ControlPlaneSceneProps = {
  className?: string;
};

/**
 * Lyzr product metaphor in 3D:
 * a control-plane hub with orbiting agents and governed traffic
 * flowing inward — what Lyzr does.
 */
export function ControlPlaneScene({ className }: ControlPlaneSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = Math.max(1, mount.clientWidth);
    let h = Math.max(1, mount.clientHeight);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x070807, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x070807, 8, 22);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 60);
    camera.position.set(-1.2, 1.4, 7.2);
    camera.lookAt(1.2, 0.2, 0);

    const root = new THREE.Group();
    root.position.set(1.5, 0.2, 0);
    scene.add(root);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(4, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb8d4ff, 1.8);
    fill.position.set(-5, 2, 3);
    scene.add(fill);
    const volt = new THREE.PointLight(0xd2ff00, 22, 18, 1.6);
    volt.position.set(1.5, 0.8, 2.5);
    scene.add(volt);

    // Floor disc
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 64),
      new THREE.MeshStandardMaterial({ color: 0x181a18, metalness: 0.55, roughness: 0.45 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.55;
    scene.add(floor);

    const chrome = new THREE.MeshStandardMaterial({
      color: 0x4a524a,
      metalness: 0.7,
      roughness: 0.35,
    });
    const voltMat = new THREE.MeshStandardMaterial({
      color: 0xd2ff00,
      metalness: 0.15,
      roughness: 0.4,
      emissive: 0xd2ff00,
      emissiveIntensity: 0.85,
    });

    // Hub = control plane
    const hub = new THREE.Group();
    root.add(hub);

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), chrome);
    hub.add(core);
    hub.add(
      new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.9, 1),
        new THREE.MeshBasicMaterial({ color: 0xd2ff00, wireframe: true, transparent: true, opacity: 0.55 }),
      ),
    );

    const rings: THREE.Mesh[] = [];
    [
      [1.7, 0.035, 0.25],
      [2.35, 0.028, -0.5],
      [3.0, 0.022, 0.95],
    ].forEach(([radius, tube, tilt]) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 96), chrome);
      ring.rotation.x = Math.PI / 2 + tilt;
      hub.add(ring);
      rings.push(ring);
    });

    const pulse = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.04, 10, 72), voltMat);
    pulse.rotation.x = Math.PI / 2.1;
    hub.add(pulse);

    // Agents
    type Agent = { pivot: THREE.Group; mesh: THREE.Mesh; speed: number; phase: number };
    const agents: Agent[] = [];
    const agentN = 12;
    for (let i = 0; i < agentN; i++) {
      const pivot = new THREE.Group();
      const radius = 1.8 + (i % 3) * 0.6;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(i % 3 === 0 ? 0.14 : 0.1, 16, 16),
        i % 4 === 0 ? voltMat : chrome,
      );
      mesh.position.x = radius;
      pivot.add(mesh);
      pivot.rotation.z = ((i * 29) % 50) * (Math.PI / 180);
      hub.add(pivot);
      agents.push({
        pivot,
        mesh,
        speed: 0.25 + (i % 5) * 0.06,
        phase: (i / agentN) * Math.PI * 2,
      });
    }

    // Spokes
    const spokePos = new Float32Array(agentN * 6);
    const spokeGeo = new THREE.BufferGeometry();
    spokeGeo.setAttribute("position", new THREE.BufferAttribute(spokePos, 3));
    const spokes = new THREE.LineSegments(
      spokeGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }),
    );
    hub.add(spokes);

    // Packets
    const packN = 28;
    const packPos = new Float32Array(packN * 3);
    const packs = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(packPos, 3)),
      new THREE.PointsMaterial({ color: 0xd2ff00, size: 0.05, transparent: true, opacity: 0.95 }),
    );
    hub.add(packs);
    const packMeta = Array.from({ length: packN }, (_, i) => ({
      agent: i % agentN,
      t: Math.random(),
      speed: 0.4 + Math.random() * 0.5,
    }));

    // Stars
    const starN = 220;
    const starPos = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 1;
      starPos[i * 3 + 2] = -4 - Math.random() * 8;
    }
    scene.add(
      new THREE.Points(
        new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(starPos, 3)),
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.45 }),
      ),
    );

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    mount.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      w = Math.max(1, mount.clientWidth);
      h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let frame = 0;
    let t = 0;
    let disposed = false;
    const tmp = new THREE.Vector3();
    const agentWorld: THREE.Vector3[] = Array.from({ length: agentN }, () => new THREE.Vector3());

    const tick = () => {
      if (disposed) return;
      frame = requestAnimationFrame(tick);
      if (!reduce) t += 0.012;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      root.rotation.y = 0.25 + pointer.x * 0.4 + (reduce ? 0 : t * 0.1);
      root.rotation.x = -0.15 + pointer.y * 0.2;

      core.rotation.y = t * 0.4;
      pulse.scale.setScalar(1 + Math.sin(t * 2.5) * 0.05);
      rings.forEach((ring, i) => {
        ring.rotation.z += reduce ? 0 : (i % 2 === 0 ? 0.006 : -0.005);
      });
      volt.intensity = 10 + Math.sin(t * 2) * 2;

      const spokeAttr = spokeGeo.getAttribute("position") as THREE.BufferAttribute;
      agents.forEach((agent, i) => {
        agent.pivot.rotation.y = agent.phase + t * agent.speed;
        agent.mesh.getWorldPosition(tmp);
        hub.worldToLocal(tmp);
        agentWorld[i].copy(tmp);
        spokeAttr.setXYZ(i * 2, 0, 0, 0);
        spokeAttr.setXYZ(i * 2 + 1, tmp.x, tmp.y, tmp.z);
      });
      spokeAttr.needsUpdate = true;

      const packAttr = packs.geometry.getAttribute("position") as THREE.BufferAttribute;
      packMeta.forEach((p, i) => {
        if (!reduce) p.t += p.speed * 0.01;
        if (p.t > 1) {
          p.t = 0;
          p.agent = Math.floor(Math.random() * agentN);
        }
        const from = agentWorld[p.agent];
        packAttr.setXYZ(i, from.x * (1 - p.t), from.y * (1 - p.t), from.z * (1 - p.t));
      });
      packAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      mount.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else (mat as THREE.Material | undefined)?.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className={className ?? "lyzr-mark-scene"} ref={mountRef} aria-hidden />;
}

export const LyzrMarkScene = ControlPlaneScene;
