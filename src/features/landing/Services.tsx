import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";
import {
  FileText,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  FileBarChart,
  Globe,
  Smartphone,
} from "lucide-react";

const ICONS = [
  FileText,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  FileBarChart,
  Globe,
  Smartphone,
];

export const Services = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal(0.1);
  const items = t("services.items", { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];

  return (
    <Section id="servicios">
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
            {t("services.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("services.title")}
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-violet-500/30 hover:bg-slate-800/60 transition-colors group cursor-default hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-violet-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-900/50 transition-colors">
                  <Icon className="text-violet-400 w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
};
