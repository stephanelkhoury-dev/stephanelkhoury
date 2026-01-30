import * as THREE from 'three';

export interface ThreeBackgroundProps {
  intensity?: number;
  particleCount?: number;
  animationSpeed?: number;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  enableMouseInteraction?: boolean;
  enableParallax?: boolean;
}

export interface AnimatedShapeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
  geometry?: 'sphere' | 'box' | 'octahedron' | 'tetrahedron' | 'icosahedron';
}

export interface ParticleSystemProps {
  count: number;
  spread: number;
  colors?: string[];
  size?: number;
  opacity?: number;
  animationSpeed?: number;
}
