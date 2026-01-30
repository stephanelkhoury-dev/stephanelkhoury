'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple Animated Geometry
function AnimatedGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.008;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    
    if (materialRef.current) {
      const hue = (state.clock.elapsedTime * 0.05) % 1;
      materialRef.current.color.setHSL(hue, 0.7, 0.6);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={meshRef} position={[0, 0, -3]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#6366f1"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

// Minimal Particle System
function MinimalParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 50;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Simple Scene
function SimpleScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#6366f1" />
      
      <Stars
        radius={30}
        depth={30}
        count={500}
        factor={2}
        saturation={0.3}
        fade
      />
      
      <AnimatedGeometry />
      <MinimalParticles />
    </>
  );
}

export default function SimpleThreeBackground() {
  return (
    <div className="absolute inset-0 -z-10 opacity-80">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 60,
        }}
        dpr={[1, 1.5]}
      >
        <SimpleScene />
      </Canvas>
    </div>
  );
}
