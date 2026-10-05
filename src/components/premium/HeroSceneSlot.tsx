'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';

const HeroSculpture = dynamic(() => import('./HeroSculpture'), {
  ssr: false,
  loading: () => null,
});

type HeroSceneSlotProps = {
  progress?: { current: number };
};

class SceneErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function RibbonFallback() {
  return (
    <div className="hero-ribbon-fallback" aria-hidden="true">
      <span className="hero-ribbon-fallback-loop hero-ribbon-fallback-loop-one" />
      <span className="hero-ribbon-fallback-loop hero-ribbon-fallback-loop-two" />
      <span className="hero-ribbon-fallback-loop hero-ribbon-fallback-loop-three" />
    </div>
  );
}

export default function HeroSceneSlot({ progress }: HeroSceneSlotProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const motionPreferenceRef = useRef(false);
  const [sceneEnabled, setSceneEnabled] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    visibleRef.current = false;
    motionPreferenceRef.current = motionPreference.matches;
    let frameId = 0;
    const syncScene = () => {
      setSceneEnabled(
        visibleRef.current &&
        !motionPreferenceRef.current &&
        document.visibilityState === 'visible',
      );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      syncScene();
    }, { rootMargin: '160px' });

    if (hostRef.current) observer.observe(hostRef.current);

    const updateMotionPreference = (event: MediaQueryListEvent) => {
      motionPreferenceRef.current = event.matches;
      syncScene();
    };

    const updateVisibility = () => syncScene();
    motionPreference.addEventListener('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updateVisibility);
    frameId = window.requestAnimationFrame(syncScene);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener('change', updateMotionPreference);
      document.removeEventListener('visibilitychange', updateVisibility);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!sceneEnabled || !hostRef.current) return;
    const canvas = hostRef.current.querySelector('canvas');
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [sceneEnabled]);

  return (
    <div ref={hostRef} className="hero-stage-scene" aria-hidden="true">
      <RibbonFallback />
      {sceneEnabled && (
        <SceneErrorBoundary fallback={<RibbonFallback />}>
          <HeroSculpture progress={progress} />
        </SceneErrorBoundary>
      )}
      {contextLost && <RibbonFallback />}
    </div>
  );
}