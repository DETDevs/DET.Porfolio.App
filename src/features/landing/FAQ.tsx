import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section } from "../../shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "../../shared/hooks/useScrollReveal";

const FAQ_DATA = [
  {
    question: "¿Cuánto cuesta desarrollar un sistema de facturación?",
    answer:
      "El costo varía según las funcionalidades que necesites. Ofrecemos planes desde sitios web básicos hasta sistemas completos a medida. Contactanos para una cotización personalizada sin compromiso.",
  },
  {
    question: "¿Qué incluye la membresía mensual?",
    answer:
      "La membresía cubre hosting, soporte técnico, mantenimiento, copias de seguridad y actualizaciones del sistema. Es todo lo que necesitás para que tu software funcione sin preocupaciones. El desarrollo se cotiza aparte.",
  },
  {
    question: "¿En cuánto tiempo entregan un proyecto?",
    answer:
      "En 3 a 5 semanas tu proyecto está listo. Proyectos más grandes pueden tomar de 1 a 3 meses, dependiendo de la complejidad. En cualquier caso, siempre mantenemos comunicación directa para que estés al tanto de cada avance.",
  },
  {
    question: "¿Ofrecen soporte después de la entrega?",
    answer:
      "Sí. No desaparecemos después de entregar. Todos nuestros planes incluyen soporte técnico y mantenimiento. Tu sistema evoluciona con tu negocio.",
  },
  {
    question: "¿Trabajan solo con empresas de Nicaragua?",
    answer:
      "No, trabajamos con clientes de toda Latinoamérica y el mundo. Somos de Nicaragua, pero nuestros sistemas no tienen fronteras.",
  },
];

const FaqItem = ({
  item,
  index,
}: {
  item: (typeof FAQ_DATA)[0];
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
  const { ref, isInView } = useScrollReveal(0.1);

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
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lo que todos preguntan
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Si tu pregunta no está aquí, escribinos por WhatsApp y te
            respondemos al toque.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_DATA.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

export { FAQ_DATA };
