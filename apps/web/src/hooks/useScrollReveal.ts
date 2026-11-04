'use client';
import { useEffect, useRef } from 'react';

/**
 * Adds `bms-visible` class to elements with `bms-reveal` class
 * when they scroll into the viewport. Triggers the bmsReveal CSS animation.
 */
export function useScrollReveal(deps?: unknown[]) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const targets = document.querySelectorAll('.bms-reveal');
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('bms-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ?? []);

  return containerRef;
}
