'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeBackgroundProps } from './types';

// Customizable Animated Shape
interface CustomShapeProps {
  geometry: 'sphere' | 'box' | 'octahedron' | 'tetrahedron';
  color: string;
  position: [number, number, number];
  scale: number;
  speed: number;
}

function CustomShape({ geometry, color, position, scale, speed }: CustomShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.01;
      meshRef.current.rotation.y += speed * 0.008;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
    }
  });

  const GeometryComponent = () => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[scale, 16, 16]} />;
      case 'box':
        return <boxGeometry args={[scale, scale, scale]} />;
      case 'octahedron':
        return <octahedronGeometry args={[scale]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[scale]} />;
      default:
        return <sphereGeometry args={[scale, 16, 16]} />;
    }
  };

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <GeometryComponent />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// Configurable Scene
function ConfigurableScene({ 
  intensity = 0.5, 
  colors = { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' },
  animationSpeed = 1 
}: Pick<ThreeBackgroundProps, 'intensity' | 'colors' | 'animationSpeed'>) {
  
  const shapes = useMemo(() => [
    {
      geometry: 'sphere' as const,
      color: colors.primary,
      position: [2, 0, -2] as [number, number, number],
      scale: 1,
      speed: animationSpeed,
    },
    {
      geometry: 'octahedron' as const,
      color: colors.secondary,
      position: [-2, 1, -3] as [number, number, number],
      scale: 0.8,
      speed: animationSpeed * 0.8,
    },
    {
      geometry: 'tetrahedron' as const,
      color: colors.accent,
      position: [0, -1, -4] as [number, number, number],
      scale: 0.6,
      speed: animationSpeed * 1.2,
    },
  ], [colors, animationSpeed]);

  return (
    <>
      <ambientLight intensity={intensity * 0.3} />
      <pointLight 
        position={[5, 5, 5]} 
        intensity={intensity} 
        color={colors.primary} 
      />
      <pointLight 
        position={[-5, -5, 5]} 
        intensity={intensity * 0.5} 
        color={colors.secondary} 
      />
      
      <Stars
        radius={40}
        depth={40}
        count={800}
        factor={3}
        saturation={0.4}
        fade
      />
      
      {shapes.map((shape, index) => (
        <CustomShape key={index} {...shape} />
      ))}
    </>
  );
}

export default function CustomizableThreeBackground({
  intensity = 0.8,
  colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899'
  },
  animationSpeed = 1,
  enableMouseInteraction = false,
}: ThreeBackgroundProps = {}) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 50,
        }}
        dpr={[1, 2]}
      >
        <ConfigurableScene 
          intensity={intensity}
          colors={colors}
          animationSpeed={animationSpeed}
        />
        
        {enableMouseInteraction && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
      </Canvas>
    </div>
  );
}
