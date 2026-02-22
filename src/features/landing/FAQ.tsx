import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";

const FaqItem = ({
  item,
  index,
}: {
  item: { question: string; answer: string };
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUpVariants}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-slate-800/50 rounded-2xl overflow-hidden hover:border-violet-500/20 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-transparent border-none cursor-pointer group"
      >
        <span className="text-sm md:text-base font-semibold text-white pr-4 group-hover:text-violet-300 transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-violet-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-400 leading-relaxed -mt-1">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FAQ = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal(0.1);
  const items = t("faq.items", { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];

  return (
    <Section id="faq">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-14">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            {t("faq.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("faq.title")}
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">{t("faq.subtitle")}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </Section>
  );
};
