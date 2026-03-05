'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Animated Sphere Component
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    if (materialRef.current) {
      materialRef.current.color.setHSL(
        (state.clock.elapsedTime * 0.1) % 1,
        0.8,
        0.6
      );
    }
  });

  return (
    <Float
      speed={1}
      rotationIntensity={1}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={[2, 0, -2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#4f46e5"
          emissive="#1e1b4b"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

// Floating Geometric Shapes
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.7,
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <Float
          key={shape.id}
          speed={shape.speed}
          rotationIntensity={0.5}
          floatIntensity={0.3}
        >
          <mesh
            position={shape.position}
            rotation={shape.rotation}
            scale={shape.scale}
          >
            {index % 3 === 0 && <boxGeometry args={[1, 1, 1]} />}
            {index % 3 === 1 && <octahedronGeometry args={[1]} />}
            {index % 3 === 2 && <tetrahedronGeometry args={[1]} />}
            <meshStandardMaterial
              color={`hsl(${(index * 60) % 360}, 70%, 60%)`}
              transparent
              opacity={0.7}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Particle Field
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesGeometry = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.001;
      pointsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particlesGeometry.positions}
          itemSize={3}
          args={[particlesGeometry.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={particlesGeometry.colors}
          itemSize={3}
          args={[particlesGeometry.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Camera Controller for mouse interaction
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      camera.position.x = x * 0.5;
      camera.position.y = y * 0.5;
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);

  return null;
}

// Grid Lines for tech aesthetic
function TechGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <gridHelper
        ref={gridRef}
        args={[40, 40, '#3b82f6', '#1e3a5f']}
      />
    </group>
  );
}

// Main Three.js Scene Component
function Scene() {
  return (
    <>
      {/* Lighting - subtle and professional */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
      
      {/* Subtle tech grid instead of stars */}
      <TechGrid />
      
      {/* Simplified animated components */}
      <FloatingShapes />
      <ParticleField />
      
      {/* Camera Controller */}
      <CameraController />
    </>
  );
}

// Main Export Component
export default function ThreeBackground() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
