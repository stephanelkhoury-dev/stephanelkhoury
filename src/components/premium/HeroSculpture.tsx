'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useEffect, useRef } from 'react';
import type { Group, PerspectiveCamera } from 'three';

const ORBITS = [
  { radius: 1.35, color: '#d9e0e5', tilt: 0.65, speed: 0.13 },
  { radius: 1.12, color: '#4867ff', tilt: -0.85, speed: -0.18 },
  { radius: 0.89, color: '#75d9c5', tilt: 1.15, speed: 0.22 },
];

function OrbitBand({ index, progress }: { index: number; progress?: { current: number } }) {
  const orbit = ORBITS[index];
  const band = useRef<Group>(null);
  const marker = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    if (band.current) {
      band.current.rotation.x = MathUtils.damp(band.current.rotation.x, orbit.tilt + Math.sin(time * 0.25 + index) * 0.18 + (progress?.current ?? 0) * 0.6, 2.5, delta);
      band.current.rotation.y = time * orbit.speed + index * 0.9;
    }
    if (marker.current) marker.current.rotation.z = time * (0.32 + index * 0.08);
  });

  return (
    <group ref={band} rotation={[orbit.tilt, index * 0.9, index * 0.7]}>
      <mesh scale={[1, 1, 0.42]}>
        <torusGeometry args={[orbit.radius, 0.055, 10, 128]} />
        <meshStandardMaterial color={orbit.color} metalness={0.75} roughness={0.23} />
      </mesh>
      <mesh rotation={[0, 0, index]}>
        <torusGeometry args={[orbit.radius + 0.075, 0.009, 6, 96, Math.PI * 1.35]} />
        <meshStandardMaterial color={orbit.color} emissive={orbit.color} emissiveIntensity={0.5} metalness={0.4} roughness={0.35} />
      </mesh>
      {Array.from({ length: 16 }, (_, tickIndex) => {
        const angle = tickIndex / 16 * Math.PI * 2;
        return (
          <mesh key={tickIndex} position={[Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.11, 0.024, 0.065]} />
            <meshStandardMaterial color={tickIndex % 4 === 0 ? '#f1f4f5' : orbit.color} metalness={0.65} roughness={0.3} />
          </mesh>
        );
      })}
      <group ref={marker}>
        <mesh position={[orbit.radius, 0, 0]}>
          <octahedronGeometry args={[0.13]} />
          <meshStandardMaterial color={index === 1 ? '#ffc86a' : orbit.color} emissive={orbit.color} emissiveIntensity={0.2} metalness={0.45} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function KineticSculpture({ progress }: { progress?: { current: number } }) {
  const group = useRef<Group>(null);
  const core = useRef<Group>(null);
  const pointerEnabled = useRef(true);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const updatePointerCapability = () => {
      pointerEnabled.current = !coarsePointer.matches;
      if (!pointerEnabled.current) pointerTarget.current = { x: 0, y: 0 };
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerEnabled.current) return;
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        pointerTarget.current = { x: 0, y: 0 };
        return;
      }
      pointerTarget.current.x = MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointerTarget.current.y = MathUtils.clamp(1 - ((event.clientY - rect.top) / rect.height) * 2, -1, 1);
    };
    const resetPointer = () => {
      pointerTarget.current = { x: 0, y: 0 };
    };
    updatePointerCapability();
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('pointerleave', resetPointer);
    coarsePointer.addEventListener('change', updatePointerCapability);
    return () => {
      coarsePointer.removeEventListener('change', updatePointerCapability);
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', resetPointer);
    };
  }, [canvas]);

  useFrame(({ clock, size }, delta) => {
    if (!group.current) return;
    const pointerX = pointerEnabled.current ? pointerTarget.current.x : 0;
    const pointerY = pointerEnabled.current ? pointerTarget.current.y : 0;
    const idle = clock.elapsedTime;
    const scrollProgress = progress?.current ?? 0;
    const wideLayout = size.width / size.height > 1.15;
    const targetX = pointerY * 0.12 + Math.sin(idle * 0.18) * 0.025 + scrollProgress * 0.35;
    const targetY = pointerX * 0.24 + Math.sin(idle * 0.16) * 0.12 + scrollProgress * 0.35;
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetX, 2, delta);
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 2, delta);
    group.current.position.x = MathUtils.damp(group.current.position.x, wideLayout ? 1.6 : 0, 2.2, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, (wideLayout ? 0 : 1.3) + Math.sin(idle * 0.42) * 0.035 - scrollProgress * 0.18, 2.2, delta);
    group.current.scale.setScalar((wideLayout ? 0.94 : 0.5) * (1 - scrollProgress * 0.045));
    if (core.current) {
      core.current.rotation.y = idle * 0.19;
      core.current.rotation.z = Math.sin(idle * 0.27) * 0.14;
    }
  });

  return (
    <group ref={group} rotation={[0.18, -0.24, -0.08]}>
      {ORBITS.map((orbit, index) => <OrbitBand key={orbit.radius} index={index} progress={progress} />)}
      <group ref={core}>
        <mesh scale={[0.65, 1, 0.65]}>
          <octahedronGeometry args={[0.61]} />
          <meshPhysicalMaterial color="#9de5e0" metalness={0.25} roughness={0.12} transparent opacity={0.72} clearcoat={1} clearcoatRoughness={0.1} flatShading />
        </mesh>
        <mesh scale={[0.67, 1.025, 0.67]}>
          <octahedronGeometry args={[0.61]} />
          <meshBasicMaterial color="#baf9ee" wireframe transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0]}>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="#ffffff" emissive="#69cabb" emissiveIntensity={0.65} metalness={0.5} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

function ResponsiveCamera() {
  const previousAspect = useRef(0);

  useFrame(({ camera, size }) => {
    const aspect = size.width / size.height;
    if (Math.abs(aspect - previousAspect.current) < 0.001) return;
    previousAspect.current = aspect;
    const perspectiveCamera = camera as PerspectiveCamera;
    perspectiveCamera.position.z = aspect < 0.82 ? 6.1 : 5.4;
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
}

export default function HeroSculpture({ progress }: { progress?: { current: number } }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={1.15} />
      <directionalLight position={[-3, 4, 5]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[4, -2, -3]} intensity={1.3} color="#b8c3ff" />
      <pointLight position={[0, 2.4, 3]} intensity={8} color="#ffffff" distance={8} />
      <KineticSculpture progress={progress} />
    </Canvas>
  );
}