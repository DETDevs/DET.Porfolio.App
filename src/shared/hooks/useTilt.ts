import { useCallback, type RefObject } from "react";

export function useTilt<T extends HTMLElement>(cardRef: RefObject<T | null>) {
  const handleMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Calculate tilt angles: max 12 degrees
      const rotateX = (0.5 - y) * 12;
      const rotateY = (x - 0.5) * 12;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const shine = el.querySelector<HTMLElement>(".card-shine");
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(163, 230, 53, 0.12) 0%, transparent 65%)`;
        shine.style.opacity = "1";
      }
    },
    [cardRef]
  );

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;

    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    const shine = el.querySelector<HTMLElement>(".card-shine");
    if (shine) {
      shine.style.opacity = "0";
    }
  }, [cardRef]);

  return { handleMove, handleLeave };
}
