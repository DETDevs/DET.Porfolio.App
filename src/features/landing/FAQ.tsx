import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/shared/ui/Section";
import { SectionTitle } from "@/shared/ui/MaskedTitle";

gsap.registerPlugin(ScrollTrigger);

const FaqItem = ({
  item,
  index,
}: {
  item: { question: string; answer: string };
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="faq-row border-b border-azul-tinta/[0.18]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-5 px-1 text-left bg-transparent border-none cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-oscura rounded-md"
      >
        <span className="text-[17px] font-semibold text-azul-tinta pr-4 group-hover:text-esmeralda-oscura transition-colors">
          {item.question}
        </span>
        <span
          className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown className="w-5 h-5 text-azul-tinta group-hover:text-esmeralda-oscura" />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <p className="m-0 px-1 pb-5 pt-1 text-[16px] text-texto-secundario leading-[1.55]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export const FAQ = () => {
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);

  const rawItems = t("faq.items", { returnObjects: true });
  const items = (Array.isArray(rawItems) ? rawItems : []) as {
    question: string;
    answer: string;
  }[];

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(listEl.querySelectorAll(".faq-row"), {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>(
        listEl.querySelectorAll(".faq-row"),
      );
      gsap.set(rows, { opacity: 0, y: 18 });

      gsap.to(rows, {
        scrollTrigger: {
          trigger: listEl,
          start: "top 85%",
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: "power3.out",
      });
    });

    return () => mm.revert();
  }, [items.length]);

  return (
    <Section
      id="faq"
      aria-labelledby="faq-titulo"
      sectionClassName="bg-rosa-niebla text-azul-tinta"
    >
      <div className="max-w-[920px] mx-auto flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-3.5">
          <p className="m-0 font-mono text-[13px] tracking-[0.06em] text-esmeralda-oscura">
            {t("faq.eyebrow", "Preguntas frecuentes")}
          </p>
          <SectionTitle
            id="faq-titulo"
            className="m-0 font-bricolage text-[clamp(36px,4.6vw,80px)] font-extrabold text-azul-tinta tracking-[-0.035em] leading-[0.98]"
            segments={[
              {
                text: t("faq.title", "Lo que todos preguntan."),
              },
            ]}
          />
          <p className="m-0 text-texto-secundario text-[clamp(16px,1.1vw,19px)] max-w-xl leading-[1.55]">
            {t("faq.subtitle")}
          </p>
        </div>

        <div
          ref={listRef}
          className="flex flex-col border-t border-azul-tinta/[0.18]"
        >
          {items.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
};
