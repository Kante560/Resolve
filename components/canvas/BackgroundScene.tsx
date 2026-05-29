"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PARTICLE_COUNT = 1200;
const buildParticles = (): Float32Array => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 24;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  return arr;
};
const PARTICLE_POSITIONS = buildParticles();

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.015;
  });
  return (
    <Points ref={ref} positions={PARTICLE_POSITIONS} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#0052FF"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

// ── Anchor Mesh (Moved from HeroScene) ───────────────────────────────────────
function AnchorMesh() {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current)  { meshRef.current.rotation.y  += delta * 0.35; }
    if (meshRef.current)  { meshRef.current.rotation.x  += delta * 0.12; }
    if (ring1Ref.current) { ring1Ref.current.rotation.z -= delta * 0.25; }
    if (ring2Ref.current) { ring2Ref.current.rotation.x += delta * 0.20; }
  });

  return (
    <group>
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

// ── Scrollytelling Tour Rig ──────────────────────────────────────────────────
function TourRig() {
  const groupRef = useRef<THREE.Group>(null!);

  useGSAP(() => {
    if (!groupRef.current) return;
    
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        }
      });

      // The sphere is centered. Let's make it dive towards the camera!
      // Camera is at z=7.
      tl.to(groupRef.current.position, {
        z: 5, 
        y: -1.5,
        x: 1.5,
        duration: 1,
        ease: "power1.inOut"
      }, 0)
      .to(groupRef.current.rotation, {
        x: Math.PI / 4,
        y: Math.PI / 3,
        duration: 1,
        ease: "power1.inOut"
      }, 0)
      
      // Stats section
      .to(groupRef.current.position, {
        z: 6, // extreme close up
        x: -2,
        y: 1,
        duration: 1,
        ease: "power1.inOut"
      }, 1)
      .to(groupRef.current.rotation, {
        x: -Math.PI / 4,
        y: -Math.PI / 2,
        duration: 1,
        ease: "power1.inOut"
      }, 1)
      
      // Why Base section
      .to(groupRef.current.position, {
        z: 3,
        x: 3,
        y: -2,
        duration: 1,
        ease: "power1.inOut"
      }, 2)
      .to(groupRef.current.rotation, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power1.inOut"
      }, 2)
      
      // Contract section
      .to(groupRef.current.position, {
        z: 0,
        x: 0,
        y: -3,
        duration: 1,
        ease: "power1.inOut"
      }, 3)
      .to(groupRef.current.rotation, {
        x: Math.PI / 8,
        y: -Math.PI / 4,
        duration: 1,
        ease: "power1.inOut"
      }, 3);
    });

  }, []);

  return (
    <group ref={groupRef}>
      <AnchorMesh />
    </group>
  );
}

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

export default function BackgroundScene() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]}   intensity={2} color="#0052FF" />
        <pointLight position={[-6, -4, -4]} intensity={1} color="#6E9EFF" />
        <ParticleField />
        <TourRig />
        <CameraRig />
      </Canvas>
    </div>
  );
}
