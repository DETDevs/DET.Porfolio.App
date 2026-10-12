import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Maximize2, Minimize2, Images, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/config/constants";
import type { Project } from "@/core/types";

gsap.registerPlugin(ScrollTrigger);

/** Desktop with a real mouse (hover states) vs. touch / no-hover (accordion). */
function useHoverPointer() {
  const query = "(any-hover: hover) and (any-pointer: fine) and (min-width: 768px)";
  const [ok, setOk] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOk(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return ok;
}

export const Projects = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const hoverMode = useHoverPointer();

  const listRef = useRef<HTMLDivElement | null>(null);

  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const items = t("projects.items", { returnObjects: true }) as {
    title: string;
    category: string;
    description: string;
  }[];

  // Merge translation with base projects
  const projectsData = useMemo(() => {
    return PROJECTS.map((projectConfig, i) => {
      const itemText = items[i] || {
        title: projectConfig.title,
        category: projectConfig.category,
        description: projectConfig.description,
      };
      return {
        ...projectConfig,
        title: itemText.title,
        category: itemText.category,
        description: itemText.description,
      };
    });
  }, [items]);

  const total = projectsData.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  const handleOpenModal = (projectConfig: Project) => {
    setSelectedProject(projectConfig);
    setMainImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsFullscreen(false);
  };

  // Mask reveal of the rows as they enter the viewport
  useEffect(() => {
    if (shouldReduceMotion || !listRef.current) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".proj-row");
      rows.forEach((row, i) => {
        const inner = row.querySelector<HTMLElement>(".proj-title-inner");
        const line = row.querySelector<HTMLElement>(".proj-line");
        const meta = row.querySelectorAll<HTMLElement>(".proj-meta");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 90%", once: true },
          delay: Math.min(i, 2) * 0.05,
        });
        if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out" }, 0);
        if (inner) tl.fromTo(inner, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power3.out" }, 0.05);
        if (meta.length) tl.fromTo(meta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.05 }, 0.25);
      });
    }, listRef);
    return () => ctx.revert();
  }, [shouldReduceMotion, projectsData.length]);

  const counterIdx = hovered ?? expanded ?? 0;

  return (
    <>
      <section
        id="proyectos"
        aria-label="Proyectos Nexol"
        className="relative w-full overflow-hidden scroll-mt-28 py-20 sm:py-28 px-6 sm:px-12 lg:px-16 bg-gradient-to-b from-[#0b0b0b] via-[#0f0f0f] to-[#0b0b0b]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(143,209,79,0.05),transparent_55%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8FD14F] block mb-3">
                {t("projects.eyebrow", "Portafolio")}
              </span>
              <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-black uppercase text-white tracking-tight leading-[1.05] max-w-3xl">
                {t("projects.title", "Proyectos que hablan por nosotros")}
              </h2>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 whitespace-nowrap">
              {t("projects.scene_label", "Proyecto")}{" "}
              <span className="text-[#8FD14F] font-bold text-sm">{pad(counterIdx + 1)}</span>{" "}
              / {pad(total)}
            </div>
          </div>

          {/* Editorial list */}
          <div
            ref={listRef}
            className="relative"
            onMouseLeave={hoverMode ? () => setHovered(null) : undefined}
          >
            <div className="flex flex-col">
              {projectsData.map((project, idx) => {
                const isOpen = expanded === idx;
                const isHot = hoverMode && hovered === idx;
                const dimmed = hoverMode && hovered !== null && hovered !== idx;
                return (
                  <div
                    key={project.id}
                    className={`proj-row relative transition-opacity duration-300 ${
                      dimmed ? "opacity-30" : "opacity-100"
                    }`}
                    onMouseEnter={hoverMode ? () => setHovered(idx) : undefined}
                  >
                    <div className="proj-line absolute top-0 left-0 right-0 h-px bg-white/10 origin-left" />

                    <button
                      type="button"
                      onClick={() =>
                        hoverMode
                          ? handleOpenModal(project)
                          : setExpanded(isOpen ? null : idx)
                      }
                      aria-expanded={hoverMode ? undefined : isOpen}
                      className="group w-full text-left bg-transparent border-none cursor-pointer py-5 sm:py-7 flex items-center gap-4 sm:gap-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F]"
                    >
                      <span className="proj-meta font-mono text-xs sm:text-sm text-[#8FD14F] w-7 sm:w-10 shrink-0">
                        {pad(idx + 1)}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block overflow-hidden pb-[0.08em]">
                          <span
                            className={`proj-title-inner block text-[clamp(1.5rem,5.6vw,5.5rem)] font-black uppercase tracking-tight leading-[1.02] text-white transition-transform duration-500 ease-out ${
                              hoverMode ? "group-hover:translate-x-4" : ""
                            } break-words`}
                          >
                            {project.title}
                          </span>
                        </span>

                        {/* Short description rises with a mask on hover (mouse only) */}
                        {hoverMode && (
                          <span
                            className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                              isHot ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                            }`}
                          >
                            <span className="block overflow-hidden">
                              <span
                                className={`block pt-2 pl-4 text-sm sm:text-base text-zinc-400 font-sans truncate transition-transform duration-500 ease-out ${
                                  isHot ? "translate-y-0" : "translate-y-full"
                                }`}
                              >
                                {project.description}
                              </span>
                            </span>
                          </span>
                        )}
                      </span>

                      <span className="proj-meta hidden md:flex flex-wrap justify-end gap-1.5 max-w-[22%] shrink-0">
                        {project.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 font-mono text-[10px] border border-white/15 text-zinc-400 uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>

                      {hoverMode ? (
                        <span
                          className={`proj-meta hidden lg:inline-flex items-center gap-1.5 text-xs font-mono shrink-0 transition-colors duration-300 ${
                            isHot ? "text-[#8FD14F]" : "text-zinc-500"
                          }`}
                        >
                          {t("projects.viewCase", "Ver caso")}
                          <span
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-500 ease-out ${
                              isHot
                                ? "border-[#8FD14F] bg-[#8FD14F] text-black rotate-0 scale-110"
                                : "border-white/15 -rotate-45"
                            }`}
                          >
                            <ArrowUpRight size={16} />
                          </span>
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className={`proj-meta font-mono text-xl text-zinc-500 transition-transform duration-300 ${
                            isOpen ? "rotate-45 text-[#8FD14F]" : ""
                          }`}
                        >
                          +
                        </span>
                      )}
                    </button>

                    {/* Touch: expandable short description + details button */}
                    {!hoverMode && (
                      <div
                        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-6 pl-11 flex flex-col gap-4">
                            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 font-mono text-[10px] bg-[#8FD14F]/10 border border-[#8FD14F]/30 text-[#8FD14F] uppercase tracking-wider"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => handleOpenModal(project)}
                              className="self-start inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-tight cursor-pointer border-none active:scale-95"
                            >
                              <span>{t("projects.viewCase", "Ver caso")}</span>
                              <ArrowUpRight size={13} className="stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="h-px bg-white/10" />
            </div>
          </div>
        </div>

      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#121212] border border-zinc-800 rounded-[2px] overflow-hidden shadow-2xl flex flex-col sm:flex-row z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-20 p-2 bg-black/80 hover:bg-black text-zinc-400 hover:text-white border border-zinc-800 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F]"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column: Big Image View */}
              <div className="flex-1 bg-[#080808] relative min-h-[40vh] sm:min-h-full flex items-center justify-center border-b sm:border-b-0 sm:border-r border-zinc-800 p-6">
                {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                  <>
                    <motion.img
                      key={mainImageIndex}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                      src={selectedProject.gallery[mainImageIndex]}
                      alt={`${selectedProject.title} vista ${mainImageIndex + 1}`}
                      className="max-w-full max-h-[50vh] sm:max-h-[70vh] object-contain rounded-[2px] border border-zinc-800 cursor-pointer"
                      onClick={() => setIsFullscreen(true)}
                    />
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 bg-[#121212] hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-[2px] transition-all border border-zinc-700 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F]"
                    >
                      <Maximize2 className="w-3 h-3 text-[#8FD14F]" />
                      Ver pantalla completa
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-black flex items-center justify-center text-zinc-500 font-mono text-xs">
                    Sin vista previa disponible
                  </div>
                )}
              </div>

              {/* Right Column: Thumbnails & Info */}
              <div className="w-full sm:w-[340px] lg:w-[400px] flex flex-col h-full max-h-[50vh] sm:max-h-[90vh] overflow-y-auto bg-[#121212]">
                <div className="p-6 pb-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                    <Images className="w-3.5 h-3.5 text-[#8FD14F]" />
                    Capturas del Sistema ({selectedProject.gallery?.length || 0})
                  </h4>
                  {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProject.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMainImageIndex(idx)}
                          aria-label={`${selectedProject.title} — Captura ${idx + 1} de ${selectedProject.gallery?.length || 0}`}
                          aria-current={mainImageIndex === idx ? "true" : undefined}
                          className={`relative aspect-video rounded-[2px] overflow-hidden border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] ${
                            mainImageIndex === idx
                              ? "border-[#8FD14F] opacity-100 ring-1 ring-[#8FD14F]"
                              : "border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${selectedProject.title} miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="p-6 mt-auto bg-[#121212] border-t border-zinc-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[#8FD14F] font-mono text-[10px] uppercase tracking-wider rounded-[2px]">
                      {selectedProject.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white mb-2 tracking-tight">
                    {selectedProject.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-5">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 font-mono text-[11px] bg-zinc-900 text-zinc-400 rounded-[2px] border border-zinc-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && selectedProject?.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              src={selectedProject.gallery[mainImageIndex]}
              alt={`${selectedProject.title} vista completa`}
              className="relative max-w-[95vw] max-h-[92vh] object-contain rounded-[2px] border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] border border-zinc-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F]"
            >
              <Minimize2 className="w-4 h-4 text-[#8FD14F]" />
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
