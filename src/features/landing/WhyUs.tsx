import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";

const STATS = ["3-5", "100%", "24/7", "∞"];

interface AnimatedStatProps {
  value: string;
  isInView: boolean;
}

const AnimatedStat = ({ value, isInView }: AnimatedStatProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value === "∞" ? "∞" : "0");
  const hasAnimated = useRef(false);

  const { targetNum, prefix, suffix, isNumeric } = useMemo(() => {
    if (value === "∞") return { targetNum: 0, prefix: "", suffix: "∞", isNumeric: false };
    if (value === "3-5") return { targetNum: 5, prefix: "3-", suffix: "", isNumeric: true };
    if (value === "24/7") return { targetNum: 24, prefix: "", suffix: "/7", isNumeric: true };

    const match = value.match(/^(\d+)(.*)$/);
    if (match) {
      return {
        targetNum: parseInt(match[1], 10),
        prefix: "",
        suffix: match[2] || "",
        isNumeric: true,
      };
    }
    return { targetNum: 0, prefix: "", suffix: value, isNumeric: false };
  }, [value]);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (!isNumeric || shouldReduceMotion) {
      setDisplay(value);
      return;
    }

    const duration = 1000; // ms
    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic: 1 - (1 - progress)^3
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeOutCubic * targetNum);

      if (value === "3-5") {
        if (progress < 0.5) {
          setDisplay(`1-2`);
        } else if (progress < 0.8) {
          setDisplay(`2-4`);
        } else {
          setDisplay(`3-5`);
        }
      } else {
        setDisplay(`${prefix}${currentVal}${suffix}`);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, targetNum, prefix, suffix, isNumeric]);

  return <span>{display}</span>;
};

export const WhyUs = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal(0.1);
  const statRef = useRef(null);
  const statsInView = useInView(statRef, { once: true, amount: 0.25 });

  const items = t("whyus.items", { returnObjects: true }) as {
    title: string;
    desc: string;
    statLabel: string;
  }[];

  return (
    <Section id="nosotros">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-14">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#8FD14F] mb-2 block">
            {t("whyus.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
            {t("whyus.title")}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t("whyus.subtitle")}
          </p>
        </motion.div>

        <div
          ref={statRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10 my-8"
        >
          {items.map((diff, i) => {
            return (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="py-10 px-6 sm:px-8 flex flex-col justify-start text-left group"
              >
                {/* Metric with animated counter */}
                <div className="mb-4">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-2">
                    <AnimatedStat value={STATS[i]} isInView={statsInView} />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#8FD14F] font-bold">
                    {diff.statLabel}
                  </div>
                </div>

                <div className="w-8 h-[2px] bg-[#8FD14F]/40 mb-4 transition-all duration-300 group-hover:w-16 group-hover:bg-[#8FD14F]" />

                <h3 className="font-bold uppercase text-white mb-2 text-sm sm:text-base tracking-tight">
                  {diff.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {diff.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
};
