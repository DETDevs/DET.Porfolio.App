import { memo, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollTo } from "@/shared/hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "nosotros", label: "¿Por qué Nexol?" },
  { id: "planes", label: "Planes" },
  { id: "contacto", label: "Contacto" },
];

const SERVICE_SCENES = [
  { id: "01", label: "POS" },
  { id: "02", label: "Cartera" },
  { id: "03", label: "Citas" },
  { id: "04", label: "Delivery" },
  { id: "05", label: "Webs" },
];

export const SectionNav = memo(function SectionNav() {
  const [active, setActive] = useState<number>(-1);
  const [activeScene, setActiveScene] = useState<number>(0);

  // Listen for scene change events from the pinned Services section
  useEffect(() => {
    const handleSceneChange = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        setActiveScene(customEvent.detail);
      }
    };

    window.addEventListener("service-scene-change", handleSceneChange);
    return () => {
      window.removeEventListener("service-scene-change", handleSceneChange);
    };
  }, []);

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
    }, 400);

    return () => {
      clearTimeout(timer);
      triggers.forEach((st) => st.kill());
    };
  }, []);

  const handleSectionClick = (id: string) => {
    scrollTo(`#${id}`, { offset: id === "servicios" ? 0 : -90, duration: 1.2 });
  };

  const handleSceneClick = (sceneIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("jump-to-service-scene", { detail: sceneIndex })
    );
  };

  return (
    <nav
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto select-none"
      aria-label="Navegación por secciones"
    >
      {SECTIONS.map((section, i) => {
        const isActive = active === i;
        const isServices = section.id === "servicios";

        return (
          <div key={section.id} className="flex flex-col items-end">
            <button
              onClick={() => handleSectionClick(section.id)}
              className="group flex items-center gap-3 cursor-pointer py-1 bg-transparent border-none focus-visible:outline-none"
              aria-label={`Ir a ${section.label}`}
            >
              <span
                className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-200 ${
                  isActive
                    ? "text-[#8FD14F] opacity-100 translate-x-0 font-bold"
                    : "text-zinc-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                }`}
              >
                {section.label}
              </span>

              <div
                className={`transition-all duration-200 rounded-full ${
                  isActive
                    ? "w-2 h-2 bg-[#8FD14F] shadow-[0_0_6px_rgba(143,209,79,0.5)]"
                    : "w-1.5 h-1.5 bg-zinc-700 group-hover:bg-zinc-400"
                }`}
              />
            </button>

            {/* When in Servicios, expand into 5 clickable sub-scene dots */}
            {isServices && isActive && (
              <div className="flex flex-col items-end gap-1.5 my-1.5 pr-0.5">
                {SERVICE_SCENES.map((scene, sceneIdx) => {
                  const isSceneActive = activeScene === sceneIdx;
                  return (
                    <button
                      key={scene.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSceneClick(sceneIdx);
                      }}
                      className="group/scene flex items-center gap-2 cursor-pointer py-0.5 bg-transparent border-none focus-visible:outline-none"
                      aria-label={`Servicio ${scene.id}: ${scene.label}`}
                    >
                      <span
                        className={`text-[9px] font-mono tracking-wider transition-all duration-200 ${
                          isSceneActive
                            ? "text-[#8FD14F] font-bold opacity-100 translate-x-0"
                            : "text-zinc-500 opacity-0 group-hover/scene:opacity-100 translate-x-1 group-hover/scene:translate-x-0"
                        }`}
                      >
                        {scene.id} {scene.label}
                      </span>
                      <div
                        className={`transition-all duration-300 rounded-full ${
                          isSceneActive
                            ? "w-4 h-1.5 bg-[#8FD14F] shadow-[0_0_8px_rgba(143,209,79,0.5)]"
                            : "w-1.5 h-1.5 bg-zinc-800 hover:bg-zinc-500"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
});
