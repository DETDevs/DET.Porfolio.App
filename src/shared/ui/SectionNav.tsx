import { useEffect, useState } from "react";
import { scrollTo } from "@/shared/hooks/useLenis";

/**
 * Sticky vertical dot navigation (right side, desktop only).
 * Highlights the section currently in viewport.
 */
const SECTIONS = [
  { id: "servicios", label: "Servicios" },
  { id: "rubros", label: "Por rubro" },
  { id: "proyectos", label: "Proyectos" },
  { id: "proceso", label: "Cómo trabajamos" },
  { id: "nosotros", label: "¿Por qué NEXOL?" },
  { id: "planes", label: "Planes" },
  { id: "faq", label: "Preguntas" },
  { id: "contacto", label: "Contacto" },
] as const;

export const SectionNav = () => {
  const [active, setActive] = useState<string>("servicios");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const handleClick = (id: string) => {
    scrollTo(`#${id}`, { offset: -60, duration: 1.2 });
  };

  return (
    <aside
      aria-label="Navegación de secciones"
      className={`fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => handleClick(id)}
            aria-label={`Ir a ${label}`}
            className="group flex items-center gap-2.5 py-0.5 cursor-pointer bg-transparent border-0"
          >
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded transition-all duration-300 ${
                isActive
                  ? "opacity-100 translate-x-0 bg-azul-tinta text-rosa-niebla font-medium"
                  : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 bg-azul-tinta/90 text-rosa-niebla"
              }`}
            >
              {label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-2.5 bg-esmeralda ring-4 ring-esmeralda/25"
                  : "w-1.5 h-1.5 bg-azul-tinta/40 group-hover:bg-azul-tinta"
              }`}
            />
          </button>
        );
      })}
    </aside>
  );
};
