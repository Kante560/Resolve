"use client";
// ─── HeroScene ───────────────────────────────────────────────────────────────
// Three.js (via @react-three/fiber) animated hero background.
// Particle positions are generated at module scope (not during render)
// so Math.random() calls are safe and idempotent per React 19 rules.

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Particles moved to global BackgroundScene

// ── Anchor Mesh ───────────────────────────────────────────────────────────────
function AnchorMesh() {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (meshRef.current)  { meshRef.current.rotation.y  += delta * 0.35; }
    if (meshRef.current)  { meshRef.current.rotation.x  += delta * 0.12; }
    if (ring1Ref.current) { ring1Ref.current.rotation.z -= delta * 0.25; }
    if (ring2Ref.current) { ring2Ref.current.rotation.x += delta * 0.20; }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.1, 0.32, 128, 24, 2, 3]} />
        <meshStandardMaterial
          color="#0052FF"
          emissive="#001aff"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.72}
        />
      </mesh>
      <mesh>
        <torusKnotGeometry args={[1.1, 0.18, 64, 16, 2, 3]} />
        <meshStandardMaterial
          color="#0039cc"
          emissive="#0026b3"
          emissiveIntensity={0.6}
          transparent
          opacity={0.18}
        />
      </mesh>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.012, 8, 80]} />
        <meshBasicMaterial color="#0052FF" transparent opacity={0.22} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.8, 0.008, 8, 80]} />
        <meshBasicMaterial color="#6E9EFF" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}



// ── Camera controller (mouse drift) ──────────────────────────────────────────
// We access camera via useFrame's `state` parameter (not useThree) so we never
// hold a direct reference to a hook return value at component scope — this
// satisfies the react-hooks/immutability rule while keeping the r3f pattern.
function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 1.4;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -0.8;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ camera }) => {
    camera.position.x += (mouse.current.x - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Scene root ────────────────────────────────────────────────────────────────
function Scene() {
  const groupRef = useRef<THREE.Group>(null!);

  useGSAP(() => {
    gsap.to(groupRef.current.position, {
      y: -4,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]}   intensity={2} color="#0052FF" />
      <pointLight position={[-6, -4, -4]} intensity={1} color="#6E9EFF" />
      <AnchorMesh />
      <CameraRig />
    </group>
  );
}

// ── Exported canvas wrapper ───────────────────────────────────────────────────
export default function HeroScene() {
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 7], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  );
}
