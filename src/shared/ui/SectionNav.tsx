import { memo, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "nosotros", label: "¿Por qué DETDevs?" },
  { id: "tracking", label: "Tracking en Vivo" },
  { id: "planes", label: "Planes" },
  { id: "contacto", label: "Contacto" },
];

export const SectionNav = memo(function SectionNav() {
  const [active, setActive] = useState<number>(-1);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const timer = setTimeout(() => {
      SECTIONS.forEach((section, i) => {
        const el = document.getElementById(section.id);
        if (!el) return;

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
        triggers.push(st);
      });
    }, 600);

    return () => {
      clearTimeout(timer);
      triggers.forEach((st) => st.kill());
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto select-none"
      aria-label="Navegación por secciones"
    >
      {SECTIONS.map((section, i) => {
        const isActive = active === i;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group flex items-center gap-3 cursor-pointer py-1"
            aria-label={`Ir a ${section.label}`}
          >
            <span
              className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-200 ${
                isActive
                  ? "text-[#a3e635] opacity-100 translate-x-0 font-bold"
                  : "text-zinc-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
              }`}
            >
              {section.label}
            </span>

            <div
              className={`transition-all duration-200 ${
                isActive
                  ? "w-2 h-2 bg-[#a3e635]"
                  : "w-1.5 h-1.5 bg-zinc-700 group-hover:bg-zinc-400"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
});
