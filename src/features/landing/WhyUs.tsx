import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { DIFFERENTIATORS } from "../../config/constants";
import { Section } from "../../shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "../../shared/hooks/useScrollReveal";

const AnimatedStat = ({
  value,
  isInView,
}: {
  value: string;
  isInView: boolean;
}) => {
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  const { numericPart, suffix, isNumeric } = useMemo(() => {
    const match = value.match(/^[\d.]+/);
    return {
      numericPart: match ? parseFloat(match[0]) : 0,
      suffix: match ? value.replace(match[0], "") : "",
      isNumeric: !!match,
    };
  }, [value]);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (!isNumeric) {
      setDisplay(value);
      return;
    }

    const steps = 30;
    const increment = numericPart / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, numericPart);
      setDisplay(Math.round(current) + suffix);
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [isInView, value, numericPart, suffix, isNumeric]);

  return <span>{display}</span>;
};

export const WhyUs = () => {
  const { ref, isInView } = useScrollReveal(0.1);
  const statRef = useRef(null);
  const statsInView = useInView(statRef, { once: true, amount: 0.3 });

  return (
    <Section id="nosotros">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-16">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            ¿Por qué DETDevs?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            La diferencia está en cómo trabajamos
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            No solo escribimos código, resolvemos problemas de negocio. Cada
            línea de código está pensada para generar valor real.
          </p>
        </motion.div>

        <div
          ref={statRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {DIFFERENTIATORS.map((diff, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-8 rounded-3xl bg-linear-to-b from-slate-900/80 to-slate-900/30 border border-slate-800/50 hover:border-violet-500/30 transition-[border-color,transform] duration-300 group text-center hover:-translate-y-1.5"
            >
              {diff.stat && (
                <div className="mb-4">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300">
                    <AnimatedStat value={diff.stat} isInView={statsInView} />
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                    {diff.statLabel}
                  </div>
                </div>
              )}

              <div className="w-12 h-12 bg-violet-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-violet-900/50 transition-colors">
                <diff.icon className="text-violet-400 w-6 h-6" />
              </div>

              <h3 className="font-bold text-white mb-2 text-lg">
                {diff.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {diff.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};
