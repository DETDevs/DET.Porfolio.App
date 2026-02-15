import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { PLANS } from "../../config/constants";
import { Button } from "../../shared/ui/Button";
import { Section } from "../../shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "../../shared/hooks/useScrollReveal";

type PricingTab = "monthly" | "semiannual" | "annual";

const TAB_LABELS: { key: PricingTab; label: string; badge?: string }[] = [
  { key: "monthly", label: "Mensual" },
  { key: "semiannual", label: "Semestral", badge: "-15%" },
  { key: "annual", label: "Anual", badge: "-25%" },
];

export const Pricing = () => {
  const [activeTab, setActiveTab] = useState<PricingTab>("monthly");
  const { ref, isInView } = useScrollReveal(0.1);

  return (
    <Section id="planes">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-10">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Inversión
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Planes Transparentes
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Escalamos contigo, desde lo básico hasta lo más complejo.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-slate-900 rounded-full p-1 border border-slate-800">
            {TAB_LABELS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-violet-500/20 text-violet-400"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              variants={fadeUpVariants}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-6 md:p-8 rounded-3xl border flex flex-col transition-[border-color,transform] duration-300 hover:-translate-y-1.5 ${
                plan.highlight
                  ? "bg-slate-900 border-violet-500 shadow-2xl shadow-violet-900/20 md:scale-105 z-10"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                  Recomendado
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">
                {plan.title}
              </h3>

              <div className="mb-4 h-10 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300"
                  >
                    {plan.prices[activeTab]}
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="text-slate-400 text-sm mb-6 min-h-[40px]">
                {plan.desc}
              </p>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat, fi) => (
                  <div
                    key={fi}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <Check className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/50587140989?text=${encodeURIComponent(`Hola, me interesa el plan "${plan.title}". ¿Podemos conversar?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Button
                  variant={plan.highlight ? "primary" : "outline"}
                  className="w-full"
                >
                  Solicitar
                </Button>
              </a>

              <p className="text-[10px] text-slate-500 text-center mt-3">
                *Aplican restricciones
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeUpVariants}
          className="text-center text-xs text-slate-500 mt-8 max-w-xl mx-auto leading-relaxed"
        >
          Los precios corresponden a la{" "}
          <span className="text-slate-400 font-medium">membresía mensual</span>,
          que incluye hosting, soporte técnico, mantenimiento y copias de
          seguridad.
        </motion.p>
      </motion.div>
    </Section>
  );
};
