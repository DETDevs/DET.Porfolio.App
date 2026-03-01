import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";

type PricingTab = "monthly" | "semiannual" | "annual";

const PLAN_IDS = ["starter", "essential", "growth", "enterprise"];
const PLAN_PRICES = {
  starter: {
    monthly: "$30",
    semiannual: "$26",
    annual: "$23",
    implementation: "$300",
  },
  essential: {
    monthly: "$49",
    semiannual: "$42",
    annual: "$37",
    implementation: "",
  },
  growth: {
    monthly: "$75",
    semiannual: "$64",
    annual: "$56",
    implementation: "",
  },
  enterprise: {
    monthly: "—",
    semiannual: "—",
    annual: "—",
    implementation: "",
  },
};
const HIGHLIGHT_PLAN = "growth";

export const Pricing = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PricingTab>("semiannual");
  const [showComparison, setShowComparison] = useState(false);
  const { ref, isInView } = useScrollReveal(0.1);

  const plans = t("pricing.plans", { returnObjects: true }) as {
    title: string;
    desc: string;
    devFeatures: string[];
    membershipFeatures: string[];
    disclaimer?: string;
    cta: string;
  }[];

  const comparison = t("pricing.comparison", { returnObjects: true }) as {
    feature: string;
    essential: boolean | string;
    professional: boolean | string;
  }[];

  const TAB_LABELS: { key: PricingTab; label: string; badge?: string }[] = [
    { key: "monthly", label: t("pricing.tabs.monthly") },
    {
      key: "semiannual",
      label: t("pricing.tabs.semiannual"),
      badge: t("pricing.tabs.recommended"),
    },
    { key: "annual", label: t("pricing.tabs.annual"), badge: "-25%" },
  ];

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
            {t("pricing.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          className="flex justify-center mb-4"
        >
          <div
            className="inline-flex bg-slate-900 rounded-full p-1 border border-slate-800"
            role="tablist"
            aria-label="Payment period"
          >
            {TAB_LABELS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
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
          {t("pricing.semiannual_note", {
            1: plans[1]?.title ?? "Esencial",
            2: plans[2]?.title ?? "Profesional",
          })
            .replace("<1>", "")
            .replace("</1>", "")
            .replace("<2>", "")
            .replace("</2>", "")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
          {plans.map((plan, i) => {
            const planId = PLAN_IDS[i];
            const isEnterprise = planId === "enterprise";
            const isHighlight = planId === HIGHLIGHT_PLAN;
            const prices = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];

            return (
              <motion.div
                key={planId}
                variants={fadeUpVariants}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border flex flex-col transition-[border-color,transform] duration-300 hover:-translate-y-1.5 ${
                  isHighlight
                    ? "bg-slate-900 border-violet-500 shadow-2xl shadow-violet-900/20 z-10"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                {isHighlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                    {t("pricing.recommended_badge")}
                  </div>
                )}

                <h3 className="text-lg font-bold text-white mb-3">
                  {plan.title}
                </h3>

                {isEnterprise ? (
                  <div className="mb-5">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300">
                      {t("pricing.quote")}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t("pricing.scope_note")}
                    </p>
                  </div>
                ) : prices.implementation ? (
                  <div className="mb-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
                      {t("pricing.from")}
                    </span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300">
                      $300
                    </span>
                  </div>
                ) : (
                  <div className="mb-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300">
                          {prices[activeTab]}
                        </span>
                        <span className="text-sm text-slate-500 font-normal">
                          {t("pricing.per_month")}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t("pricing.per_branch")}
                    </p>
                  </div>
                )}

                <p className="text-slate-400 text-sm mb-5">{plan.desc}</p>

                <div className="space-y-2 mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                    {prices.implementation
                      ? t("pricing.label_project")
                      : t("pricing.label_includes")}
                  </p>
                  {plan.devFeatures.map((feat, fi) => (
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
                    {isEnterprise
                      ? t("pricing.label_support")
                      : t("pricing.label_maintenance")}
                  </p>
                  {plan.membershipFeatures.map((feat, fi) => (
                    <div
                      key={fi}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {plan.disclaimer && (
                  <p className="text-[10px] text-slate-500 mb-6">
                    {plan.disclaimer}
                  </p>
                )}

                <div className="mt-auto">
                  <a
                    href={`https://wa.me/50587140989?text=${encodeURIComponent(`Hola, me interesa el plan "${plan.title}". ¿Podemos conversar?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                    onClick={() => {
                      import("react-ga4").then((ga) => {
                        ga.default.event({
                          category: "Leads",
                          action: "Clic WhatsApp",
                          label: `Plan ${plan.title}`,
                        });
                      });
                    }}
                  >
                    <Button
                      variant={isHighlight ? "primary" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
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
          {t("pricing.footer_note")}
        </motion.p>

        <motion.div variants={fadeUpVariants} className="mt-6">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="mx-auto flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors bg-transparent border border-slate-800 hover:border-violet-500/30 rounded-full px-6 py-2.5 cursor-pointer"
          >
            {showComparison
              ? t("pricing.hide_comparison")
              : t("pricing.show_comparison")}
            <motion.span
              animate={{ rotate: showComparison ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-8 border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-900/80">
                        <th className="text-left text-slate-400 font-medium py-3 px-4 w-1/2">
                          {t("pricing.table.feature")}
                        </th>
                        <th className="text-center text-slate-300 font-semibold py-3 px-3">
                          {plans[1]?.title}
                        </th>
                        <th className="text-center text-violet-400 font-semibold py-3 px-3">
                          {plans[2]?.title}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {comparison.map((row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-slate-900/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-slate-300">
                            {row.feature}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.essential === true ? (
                              <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                            ) : row.essential === false ? (
                              <span className="text-slate-600">—</span>
                            ) : (
                              <span className="text-slate-400 text-xs">
                                {row.essential}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.professional === true ? (
                              <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                            ) : row.professional === false ? (
                              <span className="text-slate-600">—</span>
                            ) : (
                              <span className="text-violet-300 text-xs">
                                {row.professional}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Section>
  );
};
