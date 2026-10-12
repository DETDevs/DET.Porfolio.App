import { useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PIN_QUERY = "(min-width: 1024px)";

export function useAdaptivePin(): boolean {
  const [pinned, setPinned] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(PIN_QUERY).matches;
  });


  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktopQuery = window.matchMedia(PIN_QUERY);

    const update = () => {
      const nextPinned = desktopQuery.matches;

      setPinned((prev) => {
        if (prev !== nextPinned) {
          // Refresh ScrollTrigger calculations when pinning capability changes
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 50);
          return nextPinned;
        }
        return prev;
      });
    };

    desktopQuery.addEventListener("change", update);

    return () => {
      desktopQuery.removeEventListener("change", update);
    };
  }, []);

  return pinned;
}
