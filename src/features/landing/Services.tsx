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
  Server,
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
  Server,
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
          className="text-center mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#a3e635] mb-2 block">
            {t("services.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
            {t("services.title")}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                transition={{ duration: 0.35 }}
                className="p-6 rounded-[2px] bg-[#121212] border border-zinc-800 hover:border-zinc-700 transition-colors group cursor-default text-left shadow-sm"
              >
                <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-[2px] flex items-center justify-center mb-4 text-[#a3e635]">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold uppercase text-white mb-2 text-sm tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
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
