'use client';

import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const updateScrollTrigger = () => ScrollTrigger.update();
    const tickLenis = (time: number) => lenis?.raf(time * 1000);

    const stopLenis = () => {
      if (!lenis) return;
      gsap.ticker.remove(tickLenis);
      lenis.off('scroll', updateScrollTrigger);
      lenis.destroy();
      lenis = null;
    };

    const syncMotionPreference = () => {
      if (motionPreference.matches) {
        stopLenis();
        return;
      }
      if (lenis) return;

      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.on('scroll', updateScrollTrigger);
      gsap.ticker.add(tickLenis);
      ScrollTrigger.refresh();
    };

    syncMotionPreference();
    motionPreference.addEventListener('change', syncMotionPreference);

    return () => {
      motionPreference.removeEventListener('change', syncMotionPreference);
      stopLenis();
    };
  }, []);
}

export default useSmoothScroll;
