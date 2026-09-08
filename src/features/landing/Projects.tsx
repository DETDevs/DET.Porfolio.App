import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, Eye, Images } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";
import { useTilt } from "@/shared/hooks/useTilt";
import { PROJECTS } from "@/config/constants";
import type { Project } from "@/core/types";

type ProjectFilter = "trackdeli" | "all" | "pos" | "web";

interface ProjectCardProps {
  projectConfig: Project;
  itemText: {
    title: string;
    category: string;
    description: string;
  };
  index: number;
  onOpen: () => void;
}

function ProjectCard({ projectConfig, itemText, index, onOpen }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleMove, handleLeave } = useTilt(cardRef);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative rounded-[2px] bg-[#121212] border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors duration-200 cursor-pointer flex flex-col will-change-transform shadow-sm"
    >
      {/* Subtle shine overlay */}
      <div className="card-shine absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20" />

      {/* Screenshot Container */}
      <div className="relative h-56 w-full overflow-hidden bg-black border-b border-zinc-800">
        <img
          src={projectConfig.image}
          alt={`${itemText.title} preview`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

        {/* Hover Action Pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="px-4 py-2 rounded-[2px] bg-[#a3e635] text-black font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-sm">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Proyecto</span>
          </div>
        </div>

        {/* Top Meta Badges */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/90 rounded-[2px] font-mono text-[10px] uppercase tracking-wider text-[#a3e635] border border-zinc-800">
          {itemText.category}
        </div>

        {projectConfig.gallery && projectConfig.gallery.length > 1 && (
          <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-black/90 rounded-[2px] font-mono text-[10px] text-zinc-400 border border-zinc-800 flex items-center gap-1.5">
            <Images className="w-3 h-3 text-zinc-400" />
            <span>{projectConfig.gallery.length}</span>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2 group-hover:text-[#a3e635] transition-colors">
            {itemText.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5 line-clamp-3">
            {itemText.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/80">
          {projectConfig.tags?.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 font-mono text-[11px] bg-zinc-900 text-zinc-400 rounded-[2px] border border-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export const Projects = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal(0.05);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("trackdeli");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const items = t("projects.items", { returnObjects: true }) as {
    title: string;
    category: string;
    description: string;
  }[];

  // Filtering logic:
  // "trackdeli": strictly projects with ecosystem === "trackdeli" (Legal Track USA will NEVER appear here)
  // "pos": Point of sale solutions
  // "web": Web platforms and landing pages
  // "all": Complete portfolio
  const filteredProjects = PROJECTS.filter((p) => {
    if (activeFilter === "trackdeli") return p.ecosystem === "trackdeli";
    if (activeFilter === "pos") return p.category.includes("POS") || p.category.includes("Punto de Venta");
    if (activeFilter === "web") return p.id === 1 || p.id === 5 || p.id === 6;
    return true; // "all"
  });

  const handleOpenModal = (projectConfig: Project) => {
    const originalIndex = PROJECTS.findIndex((p) => p.id === projectConfig.id);
    setSelectedProject({
      ...projectConfig,
      title: items[originalIndex]?.title || projectConfig.title,
      description: items[originalIndex]?.description || projectConfig.description,
      category: items[originalIndex]?.category || projectConfig.category,
    });
    setMainImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsFullscreen(false);
  };

  const FILTER_TABS: { id: ProjectFilter; label: string }[] = [
    { id: "trackdeli", label: "Ecosistema TrackDeli" },
    { id: "all", label: "Todos los Proyectos" },
    { id: "pos", label: "Puntos de Venta (POS)" },
    { id: "web", label: "Sitios Web & Apps" },
  ];

  return (
    <Section id="proyectos">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* Section Header */}
        <motion.div
          variants={fadeUpVariants}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#a3e635] mb-2 block">
            {t("projects.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
            {t("projects.title")}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        {/* Filter Navigation Tabs */}
        <motion.div
          variants={fadeUpVariants}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex flex-wrap justify-center gap-1.5 p-1 bg-[#121212] border border-zinc-800 rounded-[2px]">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all rounded-[2px] cursor-pointer ${
                    isActive
                      ? "bg-[#a3e635] text-black shadow-sm"
                      : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((projectConfig, i) => {
            const originalIndex = PROJECTS.findIndex((p) => p.id === projectConfig.id);
            const itemText = items[originalIndex] || {
              title: projectConfig.title,
              category: projectConfig.category,
              description: projectConfig.description,
            };

            return (
              <ProjectCard
                key={projectConfig.id}
                projectConfig={projectConfig}
                itemText={itemText}
                index={i}
                onOpen={() => handleOpenModal(projectConfig)}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#121212] border border-zinc-800 rounded-[2px] overflow-hidden shadow-2xl flex flex-col sm:flex-row z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-20 p-2 bg-black/80 hover:bg-black text-zinc-400 hover:text-white border border-zinc-800 rounded-[2px] transition-colors cursor-pointer"
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      src={selectedProject.gallery[mainImageIndex]}
                      alt={`${selectedProject.title} vista ${mainImageIndex + 1}`}
                      className="max-w-full max-h-[50vh] sm:max-h-[70vh] object-contain rounded-[2px] border border-zinc-800 cursor-pointer"
                      onClick={() => setIsFullscreen(true)}
                    />
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 bg-[#121212] hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-[2px] transition-all border border-zinc-700 shadow-sm cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3 text-[#a3e635]" />
                      Ver pantalla completa
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-black flex items-center justify-center text-zinc-600 font-mono text-xs">
                    Sin vista previa disponible
                  </div>
                )}
              </div>

              {/* Right Column: Thumbnails & Info */}
              <div className="w-full sm:w-[340px] lg:w-[400px] flex flex-col h-full max-h-[50vh] sm:max-h-[90vh] overflow-y-auto bg-[#121212]">
                <div className="p-6 pb-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                    <Images className="w-3.5 h-3.5 text-[#a3e635]" />
                    Capturas del Sistema ({selectedProject.gallery?.length || 0})
                  </h4>
                  {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProject.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMainImageIndex(idx)}
                          className={`relative aspect-video rounded-[2px] overflow-hidden border transition-all cursor-pointer ${
                            mainImageIndex === idx
                              ? "border-[#a3e635] opacity-100"
                              : "border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="p-6 mt-auto bg-[#121212] border-t border-zinc-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[#a3e635] font-mono text-[10px] uppercase tracking-wider rounded-[2px]">
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
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              src={selectedProject.gallery[mainImageIndex]}
              alt={`${selectedProject.title} vista completa`}
              className="relative max-w-[95vw] max-h-[92vh] object-contain rounded-[2px] border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] border border-zinc-700 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4 text-[#a3e635]" />
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
