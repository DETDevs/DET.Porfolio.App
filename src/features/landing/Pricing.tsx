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
          className="flex justify-center mb-4"
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

        <motion.p
          variants={fadeUpVariants}
          className="text-center text-xs text-slate-500 mb-10"
        >
          Las opciones Mensual/Semestral/Anual aplican al{" "}
          <span className="text-slate-400 font-medium">mantenimiento</span>. El
          desarrollo se paga una sola vez.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const isEnterprise = plan.id === "enterprise";

            return (
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

                <h3 className="text-xl font-bold text-white mb-4">
                  {plan.title}
                </h3>

                {isEnterprise ? (
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300">
                      Cotizar
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Desarrollo + mantenimiento según alcance.
                    </p>
                  </div>
                ) : (
                  <div className="mb-5 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Desarrollo
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {plan.implementationPrice}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Mantenimiento
                        </span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={activeTab}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300"
                        >
                          {plan.prices[activeTab]}
                          <span className="text-sm text-slate-500 font-normal">
                            /mes
                          </span>
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                <p className="text-slate-400 text-sm mb-5">{plan.desc}</p>

                <div className="space-y-2 mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                    Desarrollo
                  </p>
                  {plan.devFeatures.map((feat: string, fi: number) => (
                    <div
                      key={fi}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-3">
                    {isEnterprise ? "Soporte" : "Mantenimiento"}
                  </p>
                  {plan.membershipFeatures.map((feat: string, fi: number) => (
                    <div
                      key={fi}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {!isEnterprise && (
                  <p className="text-[10px] text-slate-600 mb-6">
                    Mejoras nuevas se cotizan aparte.
                  </p>
                )}

                <div className="mt-auto">
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
                      {isEnterprise ? "Solicitar" : "Solicitar"}
                    </Button>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          variants={fadeUpVariants}
          className="text-center text-xs text-slate-500 mt-8 max-w-lg mx-auto leading-relaxed"
        >
          Tu sistema es tuyo. Solo pagás una vez el desarrollo y luego el
          mantenimiento (mensual/semestral/anual).
        </motion.p>
      </motion.div>
    </Section>
  );
};
