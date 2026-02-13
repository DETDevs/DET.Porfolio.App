import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "../../config/constants";
import { Section } from "../../shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "../../shared/hooks/useScrollReveal";

export const Projects = () => {
  const { ref, isInView } = useScrollReveal(0.05);

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
            Portafolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Proyectos que hablan por nosotros
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Cada proyecto es una solución diseñada para resolver problemas
            reales de nuestros clientes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeUpVariants}
              transition={{ duration: 0.4 }}
              className="group rounded-3xl bg-slate-900/50 border border-slate-800/50 overflow-hidden hover:border-violet-500/30 transition-all cursor-pointer hover:-translate-y-2"
            >
              <div
                className={`h-48 bg-gradient-to-br ${project.image} relative overflow-hidden`}
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
                  {project.tags.map((tag) => (
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
    </Section>
  );
};
