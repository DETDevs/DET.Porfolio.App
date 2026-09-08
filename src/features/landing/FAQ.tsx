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
      className="border border-zinc-800 rounded-[2px] bg-[#121212] overflow-hidden hover:border-zinc-700 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-transparent border-none cursor-pointer group"
      >
        <span className="text-sm md:text-base font-medium text-white pr-4 group-hover:text-[#a3e635] transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[#a3e635]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-zinc-800/60"
          >
            <p className="px-5 md:px-6 py-4 text-sm text-zinc-400 leading-relaxed">
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
          <span className="text-[#a3e635] font-mono text-xs font-bold uppercase tracking-widest mb-3 block">
            {t("faq.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("faq.title")}
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">{t("faq.subtitle")}</p>
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
