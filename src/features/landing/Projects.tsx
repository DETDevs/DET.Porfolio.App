import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Minimize2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/config/constants";
import type { Project } from "@/core/types";
import { scrollTo } from "@/shared/hooks/useLenis";
import { SectionTitle } from "@/shared/ui/MaskedTitle";

gsap.registerPlugin(ScrollTrigger);

function useFinePointer() {
  const query = "(hover: hover) and (pointer: fine)";
  const [ok, setOk] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOk(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return ok;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const PROJECT_SOLUTIONS: Record<number, string[]> = {
  1: [
    "Despacho inteligente de pedidos en tiempo real con WebSockets.",
    "Mapas interactivos para monitoreo continuo de flota y repartidores.",
    "Portal público de seguimiento en vivo para clientes sin login.",
  ],
  2: [
    "Telemetría GPS continua con consumo eficiente de batería.",
    "Recepción y confirmación automática de órdenes asignadas.",
    "Navegación sincronizada y liquidación clara de entregas.",
  ],
  3: [
    "Pagos mixtos y en dólares en una misma venta.",
    "Cierre de caja ciego, con faltantes y sobrantes.",
    "Devoluciones con autorización del encargado.",
    "Impresora térmica y cajón de dinero conectados.",
  ],
  4: [
    "Cobro ágil en mostrador con pagos mixtos y en dólares.",
    "Inventario sincronizado con alertas automáticas de reposición.",
    "Reportes detallados de rentabilidad y cierres de turno.",
  ],
  5: [
    "Reservas en línea 24/7 con calendario interactivo en tiempo real.",
    "Confirmación automatizada y recordatorios para clientes.",
    "Panel administrativo centralizado para gestión de agenda.",
  ],
  6: [
    "Presencia web corporativa moderna de alta conversión.",
    "Canal directo de contacto y cotización vía WhatsApp.",
    "Carga ultra rápida con arquitectura limpia y SEO técnico.",
  ],
};

function getFriendlyCaption(src: string, index: number, total: number): string {
  const parts = src.split("/").pop()?.replace(/\.[^/.]+$/, "").split("_") || [];
  const baseName = parts[0] || `Captura ${index + 1}`;
  const titles: Record<string, string> = {
    dash: "Panel principal",
    pedido: "Detalle de pedido",
    pedidodetalle: "Gestión de orden",
    riders: "Flota de repartidores",
    tracking: "Rastreo en vivo",
    reportes: "Reportes analíticos",
    comisiones: "Liquidación y comisiones",
    config: "Configuración del sistema",
    caja: "Toma de órdenes y caja",
    historial: "Historial de transacciones",
    login: "Autenticación segura",
    project: "Vista general",
  };
  return titles[baseName.toLowerCase()] || `Vista ${index + 1} de ${total}`;
}

function getProjectPreviewImage(project: Project): string | null {
  if (project.image && project.image.trim().length > 0) return project.image;
  if (project.gallery && project.gallery.length > 0) return project.gallery[0];
  return null;
}

export const Projects = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const hoverMode = useFinePointer();

  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSectionNear, setIsSectionNear] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const openerButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);

  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);
  const rotToRef = useRef<gsap.QuickToFunc | null>(null);
  const lastMouseXRef = useRef<number | null>(null);
  const hasPositionInitializedRef = useRef(false);

  const [scrollActive, setScrollActive] = useState(0);

  const projectsData = useMemo(() => {
    return PROJECTS.map((p, index) => {
      const translated = t(`projects.items.${index}`, {
        returnObjects: true,
      }) as { title?: string; category?: string; description?: string };
      return {
        ...p,
        title: translated?.title || p.title,
        category: translated?.category || p.category,
        description: translated?.description || p.description,
      };
    });
  }, [t, i18n.language]);

  const total = projectsData.length;
  const counterIdx = hovered ?? (expanded ?? scrollActive);

  // Lazy preload preview images only when the section is near the viewport
  useEffect(() => {
    const secEl = sectionRef.current;
    if (!secEl) return;

    const st = ScrollTrigger.create({
      trigger: secEl,
      start: "top bottom+=450",
      once: true,
      onEnter: () => setIsSectionNear(true),
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll(".proj-row");
    const triggers: ScrollTrigger[] = [];

    rows.forEach((row, i) => {
      const st = ScrollTrigger.create({
        trigger: row,
        start: "top center+=100",
        end: "bottom center-=100",
        onEnter: () => setScrollActive(i),
        onEnterBack: () => setScrollActive(i),
      });
      triggers.push(st);
    });

    return () => triggers.forEach((st) => st.kill());
  }, [projectsData]);

  // Setup GSAP quickTo for floating cursor preview card (mouse devices only)
  useEffect(() => {
    const previewEl = previewCardRef.current;
    if (!hoverMode || !previewEl) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(previewEl, { autoAlpha: 0 });
      xToRef.current = null;
      yToRef.current = null;
      rotToRef.current = null;
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(previewEl, {
        autoAlpha: 0,
        scale: 0.9,
        rotation: -2.5,
      });

      xToRef.current = gsap.quickTo(previewEl, "x", {
        duration: 0.42,
        ease: "power3.out",
      });
      yToRef.current = gsap.quickTo(previewEl, "y", {
        duration: 0.42,
        ease: "power3.out",
      });
      rotToRef.current = gsap.quickTo(previewEl, "rotation", {
        duration: 0.48,
        ease: "power3.out",
      });
    });

    return () => mm.revert();
  }, [hoverMode]);

  // Show/hide preview card when hovered row changes
  useEffect(() => {
    const previewEl = previewCardRef.current;
    if (!hoverMode || !previewEl) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      gsap.set(previewEl, { autoAlpha: 0 });
      return;
    }

    const activeProject = hovered !== null ? projectsData[hovered] : null;
    const hasImg = activeProject ? Boolean(getProjectPreviewImage(activeProject)) : false;

    if (hovered !== null && hasImg) {
      setIsSectionNear(true);
      gsap.to(previewEl, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(previewEl, {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [hovered, hoverMode, projectsData]);

  const handleListMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverMode || !previewCardRef.current) return;
    const targetX = e.clientX + 24;
    const targetY = e.clientY - 100;

    if (!hasPositionInitializedRef.current) {
      gsap.set(previewCardRef.current, { x: targetX, y: targetY });
      hasPositionInitializedRef.current = true;
    } else {
      xToRef.current?.(targetX);
      yToRef.current?.(targetY);
    }

    if (lastMouseXRef.current !== null && rotToRef.current) {
      const vx = e.clientX - lastMouseXRef.current;
      const clampedRot = Math.max(-4.5, Math.min(4.5, -2 + vx * 0.12));
      rotToRef.current(clampedRot);
    }
    lastMouseXRef.current = e.clientX;
  };

  const handleListMouseLeave = () => {
    setHovered(null);
    lastMouseXRef.current = null;
  };

  const handleOpenModal = (
    project: Project,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (e) openerButtonRef.current = e.currentTarget;
    setSelectedProject(project);
    setMainImageIndex(0);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
    setIsFullscreen(false);
    setTimeout(() => {
      openerButtonRef.current?.focus();
    }, 50);
  }, []);

  const handlePrevProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = projectsData.findIndex(
      (p) => p.id === selectedProject.id,
    );
    const prevIndex = (currentIndex - 1 + total) % total;
    setSelectedProject(projectsData[prevIndex]);
    setMainImageIndex(0);
  }, [selectedProject, projectsData, total]);

  const handleNextProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = projectsData.findIndex(
      (p) => p.id === selectedProject.id,
    );
    const nextIndex = (currentIndex + 1) % total;
    setSelectedProject(projectsData[nextIndex]);
    setMainImageIndex(0);
  }, [selectedProject, projectsData, total]);

  const handlePrevImage = useCallback(() => {
    if (!selectedProject?.gallery) return;
    const galleryLen = selectedProject.gallery.length;
    setMainImageIndex((prev) => (prev - 1 + galleryLen) % galleryLen);
  }, [selectedProject]);

  const handleNextImage = useCallback(() => {
    if (!selectedProject?.gallery) return;
    const galleryLen = selectedProject.gallery.length;
    setMainImageIndex((prev) => (prev + 1) % galleryLen);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          handleCloseModal();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedProject,
    isFullscreen,
    handleCloseModal,
    handlePrevImage,
    handleNextImage,
  ]);

  useEffect(() => {
    const isOpen = !!selectedProject;
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    window.dispatchEvent(
      new CustomEvent("project-modal-toggle", { detail: { open: isOpen } }),
    );
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      window.dispatchEvent(
        new CustomEvent("project-modal-toggle", { detail: { open: false } }),
      );
    };
  }, [selectedProject]);

  return (
    <>
      <section
        ref={sectionRef}
        id="proyectos"
        aria-labelledby="proj-titulo"
        className="relative w-full overflow-hidden scroll-mt-24 py-[clamp(72px,9vw,160px)] bg-rosa-niebla text-azul-tinta"
      >
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] box-border flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-3.5 max-w-[900px]">
              <p className="m-0 font-mono text-[13px] tracking-[0.06em] text-esmeralda-oscura">
                {t("projects.eyebrow", "Portafolio")}
              </p>
              <SectionTitle
                id="proj-titulo"
                className="m-0 font-bricolage text-[clamp(36px,4.6vw,80px)] font-extrabold text-azul-tinta tracking-[-0.035em] leading-[0.98]"
                segments={[
                  {
                    text: t(
                      "projects.title",
                      "Proyectos que hablan por nosotros.",
                    ),
                  },
                ]}
              />
            </div>
            <span className="font-mono text-[13px] text-texto-secundario-muted whitespace-nowrap">
              {t("projects.scene_label", "Proyecto")}{" "}
              <strong className="text-esmeralda-oscura font-semibold">
                {pad(counterIdx + 1)}
              </strong>{" "}
              / {pad(total)}
            </span>
          </div>

          {/* Lista de proyectos */}
          <div
            ref={listRef}
            className="relative"
            onMouseMove={hoverMode ? handleListMouseMove : undefined}
            onMouseLeave={hoverMode ? handleListMouseLeave : undefined}
          >
            <div className="flex flex-col border-t border-azul-tinta/[0.18]">
              {projectsData.map((project, idx) => {
                const isOpen = expanded === idx;
                const isHovered = hovered === idx;
                const isActive = hoverMode
                  ? hovered !== null
                    ? isHovered
                    : scrollActive === idx
                  : isOpen || scrollActive === idx;

                return (
                  <div
                    key={project.id}
                    className="proj-row relative border-b border-azul-tinta/[0.18] transition-colors duration-200"
                    onMouseEnter={hoverMode ? () => setHovered(idx) : undefined}
                  >
                    <button
                      type="button"
                      onClick={(e) =>
                        hoverMode
                          ? handleOpenModal(project, e)
                          : setExpanded(isOpen ? null : idx)
                      }
                      aria-expanded={hoverMode ? undefined : isOpen}
                      className="group w-full text-left bg-transparent border-none cursor-pointer py-7 sm:py-8 flex items-center justify-between gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-oscura rounded-lg"
                    >
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                        <span
                          className={`font-mono text-[13px] w-7 shrink-0 transition-colors ${
                            isActive
                              ? "text-esmeralda-oscura font-medium"
                              : "text-texto-secundario-muted"
                          }`}
                        >
                          {pad(idx + 1)}
                        </span>

                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          <h3
                            className={`m-0 font-bricolage text-[clamp(32px,4.4vw,76px)] font-extrabold tracking-[-0.035em] leading-[1.02] transition-colors duration-200 truncate ${
                              isActive
                                ? "text-azul-tinta"
                                : "text-texto-atenuado group-hover:text-azul-tinta"
                            }`}
                          >
                            {project.title}
                          </h3>

                          {isActive && (
                            <span className="text-[15px] text-texto-secundario line-clamp-1 hidden sm:block">
                              {project.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Chips de tecnología en fila activa (escritorio) */}
                      {isActive && project.tags && (
                        <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs shrink-0">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 border border-azul-tinta rounded-[6px] text-azul-tinta"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Botón circular de 52 px */}
                      <div
                        className={`w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                          isActive
                            ? "bg-azul-tinta text-rosa-niebla"
                            : "border-[1.5px] border-texto-atenuado text-texto-secundario-muted group-hover:border-azul-tinta group-hover:text-azul-tinta"
                        }`}
                      >
                        <ArrowUpRight size={20} className="stroke-[2.2]" />
                      </div>
                    </button>

                    {/* Acordeón en móvil si no está en hoverMode */}
                    {!hoverMode && isOpen && (
                      <div className="pb-6 pt-1 px-2 flex flex-col gap-4 text-texto-secundario">
                        <p className="m-0 text-sm leading-relaxed">
                          {project.description}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => handleOpenModal(project, e)}
                          className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-azul-tinta text-rosa-niebla text-xs font-semibold font-mono cursor-pointer border-none"
                        >
                          <span>Ver galería y detalles</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tarjeta flotante de vista previa (solo en dispositivos con mouse: hover + pointer fine) */}
        {hoverMode && (
          <div
            ref={previewCardRef}
            id="project-hover-preview"
            aria-hidden="true"
            className="fixed top-0 left-0 z-40 w-[320px] h-[200px] rounded-[16px] overflow-hidden bg-azul-profundo border-2 border-azul-tinta shadow-[0_24px_48px_rgba(20,30,66,0.34)] pointer-events-none opacity-0 invisible will-change-transform"
          >
            {isSectionNear &&
              projectsData.map((proj, pIdx) => {
                const previewSrc = getProjectPreviewImage(proj);
                if (!previewSrc) return null;
                const isCurrent = hovered === pIdx;
                return (
                  <img
                    key={proj.id}
                    src={previewSrc}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-200 ${
                      isCurrent ? "opacity-100" : "opacity-0"
                    }`}
                  />
                );
              })}
          </div>
        )}
      </section>

      {/* ============================================================= */}
      {/* MODAL DE PROYECTO (245-referencia-portafolio-modal.html)      */}
      {/* ============================================================= */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedProject && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-project-title"
                className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
              >
            {/* Backdrop: Azul profundo al 86% */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-azul-profundo/86 backdrop-blur-xs"
              onClick={handleCloseModal}
            />

            {/* Tarjeta Modal: Rosa niebla, bordes 28px, max-w-[1180px] */}
            <motion.div
              ref={modalRef}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.96, y: 15 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 15 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.22,
                ease: "easeOut",
              }}
              className="relative w-full max-w-[1180px] bg-rosa-niebla text-azul-tinta rounded-[28px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.35)] z-10 flex flex-col lg:flex-row my-auto max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ========================================================= */}
              {/* Columna Izquierda: Galería (Fondo Azul Tinta)             */}
              {/* ========================================================= */}
              <div className="w-full lg:w-[56%] bg-azul-tinta text-rosa-niebla p-5 sm:p-7 flex flex-col gap-4 justify-between box-border">
                {/* Cabecera de galería */}
                <div className="flex items-center justify-between gap-3 text-rosa-niebla">
                  <span className="font-mono text-[13px] text-texto-azul-muted truncate">
                    Captura {mainImageIndex + 1} de{" "}
                    {selectedProject.gallery?.length || 1} ·{" "}
                    {selectedProject.gallery
                      ? getFriendlyCaption(
                          selectedProject.gallery[mainImageIndex],
                          mainImageIndex,
                          selectedProject.gallery.length,
                        )
                      : "Vista general"}
                  </span>
                  {selectedProject.gallery &&
                    selectedProject.gallery.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsFullscreen(true)}
                        className="inline-flex items-center min-h-[44px] px-3.5 rounded-[10px] border border-rosa-niebla/35 bg-transparent hover:bg-azul-tinta-claro text-rosa-niebla text-sm font-medium cursor-pointer transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-clara"
                      >
                        <span className="hidden sm:inline">
                          Ver en pantalla completa
                        </span>
                        <span className="sm:hidden">Ampliar</span>
                      </button>
                    )}
                </div>

                {/* Captura grande en proporción 16:10 */}
                <div className="relative w-full aspect-[16/10] bg-azul-profundo rounded-[16px] overflow-hidden flex items-center justify-center select-none">
                  {selectedProject.gallery &&
                  selectedProject.gallery.length > 0 ? (
                    <>
                      <img
                        src={selectedProject.gallery[mainImageIndex]}
                        alt={`${selectedProject.title} — Captura ${mainImageIndex + 1}`}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                      />

                      {/* Flechas de navegación de 44 px */}
                      {selectedProject.gallery.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrevImage}
                            aria-label="Captura anterior"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-full bg-azul-tinta hover:bg-azul-tinta-claro text-rosa-niebla flex items-center justify-center border-0 cursor-pointer transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-clara"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextImage}
                            aria-label="Captura siguiente"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-full bg-azul-tinta hover:bg-azul-tinta-claro text-rosa-niebla flex items-center justify-center border-0 cursor-pointer transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-clara"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-sm font-mono text-texto-azul-muted">
                      Vista previa no disponible
                    </div>
                  )}
                </div>

                {/* Miniaturas en botones (solo las que hay, sin cajas vacías) */}
                {selectedProject.gallery &&
                  selectedProject.gallery.length > 1 && (
                    <div className="grid grid-cols-6 gap-2 pt-1">
                      {selectedProject.gallery.map((thumb, tIdx) => {
                        const isCurrent = mainImageIndex === tIdx;
                        return (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => setMainImageIndex(tIdx)}
                            aria-label={`Captura ${tIdx + 1}`}
                            aria-current={isCurrent ? "true" : undefined}
                            className={`relative aspect-[16/10] rounded-[8px] overflow-hidden cursor-pointer p-0 transition-all ${
                              isCurrent
                                ? "border-2 border-esmeralda-clara opacity-100"
                                : "border-0 bg-azul-miniatura opacity-65 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={thumb}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>

              {/* ========================================================= */}
              {/* Columna Derecha: Información (Fondo Rosa Niebla)          */}
              {/* ========================================================= */}
              <div className="w-full lg:w-[44%] p-6 sm:p-8 flex flex-col gap-5 justify-between overflow-y-auto max-h-[50vh] lg:max-h-none box-border">
                <div className="flex flex-col gap-5">
                  {/* Encabezado: Chip blanco y Botón de cerrar de 44 px en Azul Tinta */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="py-1.5 px-3 rounded-full bg-blanco text-azul-tinta font-mono text-xs">
                      Proyecto {pad(selectedProject.id)} ·{" "}
                      {selectedProject.category}
                    </span>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      aria-label="Cerrar"
                      className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-full bg-azul-tinta hover:bg-azul-tinta-claro text-rosa-niebla flex items-center justify-center cursor-pointer border-0 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-oscura"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Título del proyecto */}
                  <h2
                    id="modal-project-title"
                    className="m-0 font-bricolage text-3xl sm:text-[42px] font-extrabold text-azul-tinta tracking-[-0.035em] leading-none"
                  >
                    {selectedProject.title}
                  </h2>

                  {/* Descripción */}
                  <p className="m-0 text-[16px] text-texto-secundario leading-[1.55]">
                    {selectedProject.description}
                  </p>

                  {/* Sección: Qué resuelve */}
                  <div className="flex flex-col gap-2.5">
                    <span className="font-mono text-xs text-texto-secundario-muted">
                      Qué resuelve
                    </span>
                    <ul className="m-0 p-0 list-none flex flex-col gap-2 text-[15px] leading-[1.45] text-azul-tinta">
                      {(
                        PROJECT_SOLUTIONS[selectedProject.id] || [
                          "Optimización operativa y reducción de tiempos de trabajo.",
                          "Control transparente y trazabilidad completa de datos.",
                          "Integración directa con herramientas del negocio.",
                        ]
                      ).map((sol, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="w-[7px] h-[7px] rounded-full bg-esmeralda mt-[7px] shrink-0"
                          />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sección: Tecnología */}
                  <div className="flex flex-col gap-2.5">
                    <span className="font-mono text-xs text-texto-secundario-muted">
                      Tecnología
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                      {selectedProject.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="py-[5px] px-[9px] rounded-[6px] border border-azul-tinta text-azul-tinta"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bloque inferior: Acciones y Navegación entre proyectos */}
                <div className="flex flex-col gap-4 mt-auto pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={`https://wa.me/50587140989?text=${encodeURIComponent(
                        `Hola NEXOL, me interesa un proyecto como ${selectedProject.title}.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center min-h-[52px] px-[22px] rounded-[12px] bg-esmeralda-oscura hover:bg-esmeralda-hover text-blanco text-[15px] font-semibold no-underline transition-colors"
                    >
                      Quiero algo así
                    </a>

                    {selectedProject.ecosystem === "nexol" && (
                      <a
                        href={
                          selectedProject.id === 3
                            ? "https://pos.nexolsoft.com"
                            : "#planes"
                        }
                        target={selectedProject.id === 3 ? "_blank" : undefined}
                        rel={
                          selectedProject.id === 3
                            ? "noopener noreferrer"
                            : undefined
                        }
                        onClick={() => {
                          if (selectedProject.id !== 3) {
                            handleCloseModal();
                            scrollTo("#planes", { offset: -80 });
                          }
                        }}
                        className="inline-flex items-center justify-center min-h-[52px] px-[18px] rounded-[12px] border-[1.5px] border-azul-tinta bg-transparent hover:bg-azul-tinta/5 text-azul-tinta text-[15px] font-semibold no-underline transition-colors"
                      >
                        {selectedProject.id === 3
                          ? "Ver NEXOL POS"
                          : "Ver planes"}
                      </a>
                    )}
                  </div>

                  {/* Navegación anterior / siguiente */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-azul-tinta/[0.18] text-sm">
                    <button
                      type="button"
                      onClick={handlePrevProject}
                      className="inline-flex items-center min-h-[44px] text-azul-tinta hover:text-esmeralda-oscura font-medium cursor-pointer bg-transparent border-0 p-0 transition-colors"
                    >
                      ← Proyecto anterior
                    </button>
                    <button
                      type="button"
                      onClick={handleNextProject}
                      className="inline-flex items-center min-h-[44px] text-azul-tinta hover:text-esmeralda-oscura font-medium cursor-pointer bg-transparent border-0 p-0 transition-colors"
                    >
                      Proyecto siguiente →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body,
    )}

      {/* Lightbox a pantalla completa */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isFullscreen && selectedProject?.gallery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-azul-profundo/95 backdrop-blur-md select-none"
                onClick={() => setIsFullscreen(false)}
              >
                <img
                  src={selectedProject.gallery[mainImageIndex]}
                  alt={`${selectedProject.title} pantalla completa`}
                  className="relative max-w-[95vw] max-h-[90vh] object-contain rounded-xl border border-blanco/20"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-rosa-niebla text-azul-tinta font-mono text-xs font-bold rounded-full border-none cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4 text-azul-tinta" />
                  Cerrar
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
