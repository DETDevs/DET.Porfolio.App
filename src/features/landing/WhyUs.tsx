import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/shared/ui/Section";
import { SectionTitle } from "@/shared/ui/MaskedTitle";

gsap.registerPlugin(ScrollTrigger);

export const WhyUs = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const stat35Ref = useRef<HTMLSpanElement>(null);
  const checkPathRef = useRef<SVGPathElement>(null);
  const stat12Ref = useRef<HTMLSpanElement>(null);
  const infinityRef = useRef<HTMLSpanElement>(null);

  const items = [
    {
      id: "fast",
      stat: "3–5",
      statLabel: t("whyus.items.0.statLabel", "Semanas para entrega"),
      title: t("whyus.items.0.title", "Entrega rápida"),
      desc: t(
        "whyus.items.0.desc",
        "Mientras otros cotizan, nosotros ya vamos por la mitad.",
      ),
      isBlue: false,
    },
    {
      id: "tested",
      stat: "✓",
      statLabel: t("whyus.items.1.statLabel", "Código probado"),
      title: t("whyus.items.1.title", "Código probado"),
      desc: t(
        "whyus.items.1.desc",
        "Lo que entregamos se prueba antes de llegar a tu negocio.",
      ),
      isBlue: false,
    },
    {
      id: "support",
      stat: "12",
      statLabel: t("whyus.items.2.statLabel", "Meses de mantenimiento"),
      title: t("whyus.items.2.title", "Soporte continuo"),
      desc: t(
        "whyus.items.2.desc",
        "No desaparecemos después de entregar. Soporte técnico y mantenimiento incluidos.",
      ),
      isBlue: true,
    },
    {
      id: "scale",
      stat: "∞",
      statLabel: t("whyus.items.3.statLabel", "Potencial de escala"),
      title: t("whyus.items.3.title", "Escalabilidad"),
      desc: t(
        "whyus.items.3.desc",
        "Sistemas diseñados para crecer contigo, de una sucursal a varias.",
      ),
      isBlue: false,
    },
  ];

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(containerEl.querySelectorAll(".whyus-card"), {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
      if (stat35Ref.current) stat35Ref.current.textContent = "3–5";
      if (stat12Ref.current) stat12Ref.current.textContent = "12";
      if (checkPathRef.current) {
        gsap.set(checkPathRef.current, {
          clearProps: "all",
          strokeDashoffset: 0,
        });
      }
      if (infinityRef.current) {
        gsap.set(infinityRef.current, {
          clearProps: "all",
          rotation: 0,
          scale: 1,
          opacity: 1,
        });
      }
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        containerEl.querySelectorAll(".whyus-card"),
      );
      gsap.set(cards, { opacity: 0, y: 28 });

      if (stat35Ref.current) stat35Ref.current.textContent = "0–0";
      if (stat12Ref.current) stat12Ref.current.textContent = "0";
      if (checkPathRef.current) {
        gsap.set(checkPathRef.current, {
          strokeDasharray: 80,
          strokeDashoffset: 80,
        });
      }
      if (infinityRef.current) {
        gsap.set(infinityRef.current, {
          rotation: -32,
          scale: 0.72,
          opacity: 0,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl.querySelector(".whyus-grid"),
          start: "top 82%",
          once: true,
        },
      });

      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: "power3.out",
        },
        0,
      );

      // 1. "3–5" cuenta hacia arriba
      const c35 = { a: 0, b: 0 };
      tl.to(
        c35,
        {
          a: 3,
          b: 5,
          duration: 0.75,
          ease: "power3.out",
          onUpdate: () => {
            if (stat35Ref.current) {
              stat35Ref.current.textContent = `${Math.round(c35.a)}–${Math.round(c35.b)}`;
            }
          },
        },
        0.1,
      );

      // 2. El "✓" se dibuja como trazo
      if (checkPathRef.current) {
        tl.to(
          checkPathRef.current,
          {
            strokeDashoffset: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          0.18,
        );
      }

      // 3. "12" cuenta hacia arriba
      const c12 = { val: 0 };
      tl.to(
        c12,
        {
          val: 12,
          duration: 0.8,
          ease: "power3.out",
          onUpdate: () => {
            if (stat12Ref.current) {
              stat12Ref.current.textContent = `${Math.round(c12.val)}`;
            }
          },
        },
        0.24,
      );

      // 4. El "∞" entra con un giro corto
      if (infinityRef.current) {
        tl.to(
          infinityRef.current,
          {
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
          },
          0.32,
        );
      }
    });

    return () => mm.revert();
  }, []);

  const renderStat = (item: (typeof items)[number]) => {
    if (item.id === "fast") {
      return (
        <span
          ref={stat35Ref}
          className="font-bricolage text-[clamp(48px,5vw,88px)] font-extrabold text-azul-tinta tracking-[-0.03em] leading-none"
        >
          3–5
        </span>
      );
    }
    if (item.id === "tested") {
      return (
        <span
          role="img"
          aria-label="✓"
          className="inline-flex items-center font-bricolage text-[clamp(48px,5vw,88px)] font-extrabold text-azul-tinta leading-none h-[1em]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 56 56"
            className="w-[0.82em] h-[0.82em] overflow-visible"
          >
            <path
              ref={checkPathRef}
              d="M9 30 L22 43 L47 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    }
    if (item.id === "support") {
      return (
        <span
          ref={stat12Ref}
          className="font-bricolage text-[clamp(48px,5vw,88px)] font-extrabold text-esmeralda-clara tracking-[-0.03em] leading-none"
        >
          12
        </span>
      );
    }
    return (
      <span
        ref={infinityRef}
        className="inline-block origin-center self-start font-bricolage text-[clamp(48px,5vw,88px)] font-extrabold text-azul-tinta tracking-[-0.03em] leading-none will-change-transform"
      >
        ∞
      </span>
    );
  };

  return (
    <Section
      id="nosotros"
      sectionClassName="overflow-hidden bg-blanco text-azul-tinta"
    >
      <div ref={containerRef} className="w-full flex flex-col gap-12">
        {/* Encabezado */}
        <div className="flex flex-col gap-3.5 max-w-[900px]">
          <p className="m-0 font-mono text-[13px] tracking-[0.06em] text-esmeralda-oscura">
            {t("whyus.eyebrow", "¿Por qué NEXOL?")}
          </p>
          <SectionTitle
            className="m-0 font-bricolage text-[clamp(36px,4.6vw,80px)] font-extrabold text-azul-tinta tracking-[-0.035em] leading-[0.98]"
            segments={[
              {
                text: t(
                  "whyus.title",
                  "La diferencia de trabajar con nosotros.",
                ),
              },
            ]}
          />
          <p className="m-0 text-texto-secundario text-[clamp(16px,1.1vw,19px)] max-w-[680px] leading-[1.55]">
            {t(
              "whyus.subtitle",
              "No somos una agencia genérica ni vendemos sistemas enlatados. Desarrollamos herramientas que se adaptan a cómo opera tu comercio en Nicaragua.",
            )}
          </p>
        </div>

        {/* 4 Tarjetas */}
        <div className="whyus-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {items.map((item) => {
            if (item.isBlue) {
              return (
                <div
                  key={item.id}
                  className="whyus-card bg-azul-tinta text-rosa-niebla rounded-[24px] p-7 sm:p-8 flex flex-col gap-2.5"
                >
                  {renderStat(item)}
                  <span className="font-mono text-xs text-texto-azul-muted">
                    {item.statLabel}
                  </span>
                  <h3 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-rosa-niebla mt-2 leading-tight tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="m-0 text-[15px] text-texto-azul leading-[1.5]">
                    {item.desc}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="whyus-card bg-rosa-niebla text-azul-tinta rounded-[24px] p-7 sm:p-8 flex flex-col gap-2.5"
              >
                {renderStat(item)}
                <span className="font-mono text-xs text-texto-secundario-muted">
                  {item.statLabel}
                </span>
                <h3 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-azul-tinta mt-2 leading-tight tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="m-0 text-[15px] text-texto-secundario leading-[1.5]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
