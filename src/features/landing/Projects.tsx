import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";
import { PROJECTS } from "@/config/constants";
import type { Project } from "@/core/types";

export const Projects = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal(0.05);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const items = t("projects.items", { returnObjects: true }) as {
    title: string;
    category: string;
    description: string;
  }[];

  const handleOpenModal = (projectIndex: number) => {
    const projectConfig = PROJECTS[projectIndex];
    if (projectConfig) {
      setSelectedProject({
        ...projectConfig,
        title: items[projectIndex]?.title || projectConfig.title,
        description:
          items[projectIndex]?.description || projectConfig.description,
        category: items[projectIndex]?.category || projectConfig.category,
      });
      setMainImageIndex(0);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsFullscreen(false);
  };

  return (
    <Section id="proyectos">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeUpVariants}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            {t("projects.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("projects.title")}
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((project, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              transition={{ duration: 0.4 }}
              onClick={() => handleOpenModal(i)}
              className="group rounded-3xl bg-slate-900/50 border border-slate-800/50 overflow-hidden hover:border-violet-500/30 transition-[border-color,transform] duration-300 cursor-pointer hover:-translate-y-2"
            >
              <div
                className={`h-48 bg-linear-to-br ${PROJECTS[i]?.image || "from-slate-600 to-slate-900"} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ExternalLink className="text-white w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                  {project.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {PROJECTS[i]?.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs bg-slate-800 text-slate-400 rounded-full border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-slate-300 hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-black/50 relative min-h-[40vh] sm:min-h-full flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-800 p-6">
                {selectedProject.gallery &&
                selectedProject.gallery.length > 0 ? (
                  <>
                    <motion.img
                      key={mainImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      src={selectedProject.gallery[mainImageIndex]}
                      alt={`${selectedProject.title} vista ${mainImageIndex + 1}`}
                      className="max-w-full max-h-[50vh] sm:max-h-[70vh] object-contain rounded-xl shadow-lg border border-slate-800/50 cursor-pointer"
                      onClick={() => setIsFullscreen(true)}
                    />
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-slate-300 hover:text-white text-xs font-medium transition-all border border-slate-700/50 hover:border-slate-600"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Ver imagen completa
                    </button>
                  </>
                ) : (
                  <div
                    className={`w-full h-full min-h-[300px] rounded-xl bg-linear-to-br ${selectedProject.image} flex items-center justify-center opacity-80`}
                  >
                    <span className="text-white/50 font-medium">
                      No hay vista previa disponible
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-[320px] lg:w-[400px] flex flex-col h-full max-h-[50vh] sm:max-h-[90vh] overflow-y-auto bg-slate-900/90">
                <div className="p-6 pb-2">
                  <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
                    Galería del Proyecto
                  </h4>
                  {selectedProject.gallery &&
                  selectedProject.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedProject.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMainImageIndex(idx)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            mainImageIndex === idx
                              ? "border-violet-500 scale-105 shadow-md shadow-violet-500/20"
                              : "border-transparent hover:border-slate-700 opacity-60 hover:opacity-100"
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
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No se encontraron más imágenes.
                    </p>
                  )}
                </div>

                <div className="p-6 mt-auto bg-slate-900/80 border-t border-slate-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-medium rounded-full border border-violet-500/20">
                      {selectedProject.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {selectedProject.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-md border border-slate-700/50 flex items-center gap-1.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400/50" />
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

      <AnimatePresence>
        {isFullscreen && selectedProject?.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedProject.gallery[mainImageIndex]}
              alt={`${selectedProject.title} vista completa`}
              className="relative max-w-[95vw] max-h-[95vh] object-contain rounded-2xl shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium transition-all border border-white/10"
            >
              <Minimize2 className="w-4 h-4" />
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
