import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";

export const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative px-4 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center bg-[#050505]"
    >
      <motion.div style={{ opacity }} className="relative z-10 max-w-4xl pt-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[#a3e635] font-mono text-xs uppercase tracking-widest rounded-[2px] mb-8"
        >
          <span className="w-1.5 h-1.5 bg-[#a3e635]" />
          <span>{t("hero.badge")}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-white mb-6 leading-[1.05] tracking-tight"
        >
          {t("hero.title_1")} <br className="hidden md:block" />
          <span className="text-[#a3e635]">
            {t("hero.title_2")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-zinc-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#planes" className="w-full sm:w-auto no-underline">
            <Button className="w-full">
              <span>{t("hero.cta_primary")}</span>
              <ArrowRight size={15} />
            </Button>
          </a>
          <a href="#servicios" className="w-full sm:w-auto no-underline">
            <Button variant="secondary" className="w-full">
              <span>{t("hero.cta_secondary")}</span>
            </Button>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 z-10"
      >
        <a href="#servicios" className="no-underline">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="cursor-pointer text-zinc-600 hover:text-[#a3e635] transition-colors"
          >
            <ChevronDown size={24} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
