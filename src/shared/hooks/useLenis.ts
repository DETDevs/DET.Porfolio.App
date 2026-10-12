import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let globalLenis: Lenis | null = null;

export const getLenis = () => globalLenis;

export const scrollTo = (
  target: string | HTMLElement | number,
  options?: { offset?: number; immediate?: boolean; duration?: number }
) => {
  if (globalLenis) {
    globalLenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      immediate: options?.immediate ?? false,
      duration: options?.duration ?? 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: options?.immediate ? "auto" : "smooth" });
      }
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options?.immediate ? "auto" : "smooth" });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: options?.immediate ? "auto" : "smooth" });
    }
  }
};

export function useLenisSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Initial update
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
      if (globalLenis === lenis) {
        globalLenis = null;
      }
    };
  }, []);

  return lenisRef;
}
