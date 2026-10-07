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
      className={`transition-colors duration-200 ${
        isOpen ? "bg-white/[0.03]" : "bg-transparent"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-transparent border-none cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-inset"
      >
        <span className="text-sm md:text-base font-medium text-white pr-4 group-hover:text-[#8FD14F] transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[#8FD14F]" />
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
            <p className="px-5 md:px-6 pb-5 pt-1 text-sm text-zinc-300 leading-relaxed">
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
  const rawItems = t("faq.items", { returnObjects: true });
  const items = (Array.isArray(rawItems) ? rawItems : []) as {
    question: string;
    answer: string;
  }[];

  return (
    <Section id="faq" sectionClassName="pt-20 md:pt-28 pb-8 md:pb-12">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-14">
          <span className="text-[#8FD14F] font-mono text-xs font-bold uppercase tracking-widest mb-3 block">
            {t("faq.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("faq.title")}
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">{t("faq.subtitle")}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto border border-zinc-800 rounded-[2px] bg-[#121212] overflow-hidden divide-y divide-zinc-800/80">
          {items.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </Section>
  );
};
