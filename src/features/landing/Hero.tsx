import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { scrollTo } from "@/shared/hooks/useLenis";
import { MaskedWords, groupWordsByVisualLine } from "@/shared/ui/MaskedTitle";

interface ProductOption {
  id: string;
  targetId: string;
  highlighted?: boolean;
}

const PRODUCT_OPTIONS: ProductOption[] = [
  { id: "pos", targetId: "#svc-pos", highlighted: true },
  { id: "cartera", targetId: "#svc-cobros" },
  { id: "citas", targetId: "#svc-citas" },
  { id: "delivery", targetId: "#svc-delivery" },
  { id: "web", targetId: "#svc-web" },
];

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    const titleEl = titleRef.current;
    if (!heroEl || !titleEl) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const words = titleEl.querySelectorAll<HTMLElement>("[data-mask-word]");
      gsap.set(words, { clearProps: "all", yPercent: 0, opacity: 1 });
      gsap.set(
        [
          ".hero-paragraph",
          ".hero-actions",
          ".hero-panel",
          ".hero-option-item",
        ],
        { clearProps: "all", opacity: 1, x: 0, y: 0 },
      );
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lineGroups = groupWordsByVisualLine(titleEl);
      const allWords = lineGroups.flat();

      gsap.set(allWords, { yPercent: 110, opacity: 0 });
      gsap.set([".hero-paragraph", ".hero-actions"], { opacity: 0, y: 18 });
      gsap.set(".hero-panel", { opacity: 0, x: 24 });
      gsap.set(".hero-option-item", { opacity: 0, y: 14 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      lineGroups.forEach((group, idx) => {
        tl.to(
          group,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
          },
          idx * 0.08,
        );
      });

      const afterLines = Math.min(lineGroups.length * 0.08 + 0.06, 0.34);

      tl.to(
        ".hero-paragraph",
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
        },
        afterLines,
      )
        .to(
          ".hero-actions",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          afterLines + 0.08,
        )
        .to(
          ".hero-panel",
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
          },
          0.24,
        )
        .to(
          ".hero-option-item",
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.06,
          },
          0.4,
        );
    });

    return () => mm.revert();
  }, [i18n.language]);

  const handleOptionClick = (targetId: string) => {
    scrollTo(targetId, { offset: -90, duration: 1.2 });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Hero NEXOL"
      className="relative w-full bg-rosa-niebla text-azul-tinta mt-[96px] sm:mt-[108px] min-h-[calc(100svh-96px)] sm:min-h-[calc(100svh-108px)] flex items-center py-12 lg:py-20 overflow-hidden"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] box-border flex flex-wrap gap-8 lg:gap-12 items-center">
        {/* Columna Izquierda: Título, subtítulo y CTAs */}
        <div className="flex-[999_1_560px] min-w-0 flex flex-col justify-center gap-7 py-2">
          {/* Título en Bricolage: clamp(44px, 6.2vw, 112px), entrada por líneas con máscara */}
          <h1
            ref={titleRef}
            id="hero-titulo"
            className="m-0 font-bricolage text-[clamp(44px,6.2vw,112px)] leading-[0.96] tracking-[-0.04em]"
          >
            <MaskedWords
              segments={[
                {
                  text: t("hero.title_main", "Tu negocio, en orden."),
                  className: "font-extrabold text-azul-tinta",
                },
                {
                  text: t(
                    "hero.title_sub",
                    "Desde la caja hasta el último cobro.",
                  ),
                  className: "font-normal text-texto-secundario",
                },
              ]}
            />
          </h1>

          {/* Párrafo descriptivo: clamp(17px, 1.3vw, 22px) */}
          <p className="hero-paragraph m-0 max-w-[600px] text-[clamp(17px,1.3vw,22px)] leading-[1.55] text-texto-secundario">
            {t(
              "hero.subtitle",
              "Sistemas listos para comercios de Nicaragua y software a la medida cuando necesitás algo propio. Te lo instalamos, te capacitamos y te acompañamos.",
            )}
          </p>

          {/* Botones de acción */}
          <div className="hero-actions flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => scrollTo("#planes", { offset: -80 })}
              className="inline-flex items-center min-h-[54px] px-7 rounded-[12px] bg-azul-tinta hover:bg-azul-tinta-claro text-rosa-niebla text-[16px] sm:text-[17px] font-semibold transition-colors cursor-pointer border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-tinta"
            >
              {t("hero.cta_primary", "Ver planes")}
            </button>

            <button
              type="button"
              onClick={() => scrollTo("#servicios", { offset: -90 })}
              className="inline-flex items-center min-h-[54px] px-6 rounded-[12px] text-azul-tinta hover:text-esmeralda-oscura underline underline-offset-[5px] text-[16px] sm:text-[17px] font-semibold transition-colors cursor-pointer bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-tinta"
            >
              {t("hero.cta_secondary", "Nuestros servicios")}
            </button>
          </div>
        </div>

        {/* Columna Derecha: Panel Azul Tinta con 5 opciones */}
        <section
          aria-labelledby="pick-titulo"
          className="hero-panel flex-[1_1_420px] min-w-0 bg-azul-tinta text-rosa-niebla rounded-[28px] p-7 sm:p-9 box-border flex flex-col gap-6 will-change-transform"
        >
          <h2
            id="pick-titulo"
            className="m-0 font-bricolage font-semibold text-[clamp(26px,2vw,30px)] text-rosa-niebla leading-tight"
          >
            {t("hero.panel_title", "¿Qué necesita tu negocio?")}
          </h2>

          <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
            {PRODUCT_OPTIONS.map((opt) => {
              const mainText = t(`hero.options.${opt.id}.main`);
              const productText = t(`hero.options.${opt.id}.product`);

              if (opt.highlighted) {
                return (
                  <li key={opt.id} className="hero-option-item">
                    <button
                      type="button"
                      onClick={() => handleOptionClick(opt.targetId)}
                      className="group w-full text-left flex justify-between items-center gap-4 min-h-[68px] px-5 py-3 rounded-[14px] bg-rosa-niebla hover:bg-blanco text-azul-tinta cursor-pointer border-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-clara"
                    >
                      <span>
                        <strong className="font-semibold text-[17px] sm:text-[18px] text-azul-tinta block leading-snug">
                          {mainText}
                        </strong>
                        <span className="text-[14px] text-texto-secundario">
                          {productText}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-block text-[20px] text-azul-tinta transition-transform duration-200 group-hover:translate-x-[4px] motion-reduce:group-hover:translate-x-0"
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={opt.id} className="hero-option-item">
                  <button
                    type="button"
                    onClick={() => handleOptionClick(opt.targetId)}
                    className="group w-full text-left flex justify-between items-center gap-4 min-h-[68px] px-5 py-3 rounded-[14px] bg-transparent hover:bg-azul-tinta-claro border border-rosa-niebla/30 text-rosa-niebla cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-clara"
                  >
                    <span>
                      <strong className="font-semibold text-[17px] sm:text-[18px] text-rosa-niebla block leading-snug">
                        {mainText}
                      </strong>
                      <span className="text-[14px] text-texto-azul">
                        {productText}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-block text-[20px] text-rosa-niebla transition-transform duration-200 group-hover:translate-x-[4px] motion-reduce:group-hover:translate-x-0"
                    >
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </section>
  );
};
