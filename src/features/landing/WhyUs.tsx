import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Zap, Shield, HeadsetIcon, Rocket } from "lucide-react";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";

const ICONS = [Zap, Shield, HeadsetIcon, Rocket];
const STATS = ["3-5", "100%", "24/7", "∞"];

interface AnimatedStatProps {
  value: string;
  isInView: boolean;
}

const AnimatedStat = ({ value, isInView }: AnimatedStatProps) => {
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

    if (!isNumeric) {
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
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#a3e635] mb-2 block">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((diff, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-8 rounded-[2px] bg-[#121212] border border-zinc-800 hover:border-zinc-700 transition-colors group text-left shadow-sm"
              >
                {/* Metric with animated counter (solid white, no gradients) */}
                <div className="mb-6">
                  <div className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                    <AnimatedStat value={STATS[i]} isInView={statsInView} />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-zinc-400 mt-1">
                    {diff.statLabel}
                  </div>
                </div>

                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-[2px] flex items-center justify-center mb-4 text-[#a3e635]">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-bold uppercase text-white mb-2 text-base tracking-tight">
                  {diff.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
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
