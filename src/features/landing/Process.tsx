import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/shared/ui/Section";
import { CONTACT_INFO } from "@/config/constants";
import { SectionTitle } from "@/shared/ui/MaskedTitle";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Nos contás",
    desc: "Escribinos por WhatsApp y contanos cómo funciona tu negocio hoy.",
  },
  {
    num: "02",
    title: "Te mostramos",
    desc: "Te hacemos una demostración con tu tipo de negocio y te decimos qué te conviene.",
  },
  {
    num: "03",
    title: "Instalamos y capacitamos",
    desc: "Dejamos el sistema funcionando en tu local y le enseñamos a tu equipo a usarlo.",
  },
  {
    num: "04",
    title: "Te acompañamos",
    desc: "12 meses de mantenimiento y soporte incluidos. No desaparecemos después de entregar.",
  },
];

export const Process = () => {
  const { t } = useTranslation();
  const listRef = useRef<HTMLOListElement>(null);

  const rawSteps = t("proceso.steps", { returnObjects: true });
  const steps = (
    Array.isArray(rawSteps) && rawSteps.length === 4 ? rawSteps : DEFAULT_STEPS
  ) as ProcessStep[];

  const cleanPhone = CONTACT_INFO.phone.replace(/[^0-9]/g, "");
  const whatsappHref = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hola NEXOL, quiero empezar por el paso 1 y contarles cómo funciona mi negocio.",
  )}`;

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(listEl.querySelectorAll("[data-proc-line-h]"), {
        clearProps: "all",
        scaleX: 1,
      });
      gsap.set(listEl.querySelectorAll("[data-proc-line-v]"), {
        clearProps: "all",
        scaleY: 1,
      });
      gsap.set(listEl.querySelectorAll("[data-proc-step]"), {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const hLines = gsap.utils.toArray<HTMLElement>(
        listEl.querySelectorAll("[data-proc-line-h]"),
      );
      const vLines = gsap.utils.toArray<HTMLElement>(
        listEl.querySelectorAll("[data-proc-line-v]"),
      );
      const stepEls = gsap.utils.toArray<HTMLElement>(
        listEl.querySelectorAll("[data-proc-step]"),
      );

      gsap.set(hLines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(vLines, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(stepEls, { opacity: 0.18, y: 18 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: listEl,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.45,
        },
      });

      // Paso 01 aparece al inicio del recorrido
      if (stepEls[0]) {
        tl.to(
          stepEls[0],
          { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" },
          0,
        );
      }

      // Tramo 1 -> Paso 02
      if (hLines[0]) {
        tl.to(
          hLines[0],
          { scaleX: 1, duration: 0.3, ease: "none" },
          0.1,
        );
      }
      if (vLines[0]) {
        tl.to(
          vLines[0],
          { scaleY: 1, duration: 0.3, ease: "none" },
          0.1,
        );
      }
      if (stepEls[1]) {
        tl.to(
          stepEls[1],
          { opacity: 1, y: 0, duration: 0.22, ease: "power3.out" },
          0.32,
        );
      }

      // Tramo 2 -> Paso 03
      if (hLines[1]) {
        tl.to(
          hLines[1],
          { scaleX: 1, duration: 0.3, ease: "none" },
          0.4,
        );
      }
      if (vLines[1]) {
        tl.to(
          vLines[1],
          { scaleY: 1, duration: 0.3, ease: "none" },
          0.4,
        );
      }
      if (stepEls[2]) {
        tl.to(
          stepEls[2],
          { opacity: 1, y: 0, duration: 0.22, ease: "power3.out" },
          0.62,
        );
      }

      // Tramo 3 -> Paso 04
      if (hLines[2]) {
        tl.to(
          hLines[2],
          { scaleX: 1, duration: 0.3, ease: "none" },
          0.7,
        );
      }
      if (vLines[2]) {
        tl.to(
          vLines[2],
          { scaleY: 1, duration: 0.3, ease: "none" },
          0.7,
        );
      }
      if (stepEls[3]) {
        tl.to(
          stepEls[3],
          { opacity: 1, y: 0, duration: 0.22, ease: "power3.out" },
          0.92,
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <Section
      id="proceso"
      aria-labelledby="proceso-titulo"
      sectionClassName="bg-azul-tinta text-rosa-niebla overflow-hidden"
    >
      <div className="flex flex-col gap-12 lg:gap-16">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 max-w-[960px]">
          <p className="m-0 font-mono text-[13px] tracking-[0.06em] text-esmeralda-clara">
            {t("proceso.eyebrow", "Cómo trabajamos")}
          </p>
          <SectionTitle
            id="proceso-titulo"
            className="m-0 font-bricolage text-[clamp(36px,4.6vw,80px)] font-extrabold text-rosa-niebla tracking-[-0.035em] leading-[1.02]"
            segments={[
              {
                text: t(
                  "proceso.title",
                  "De la primera charla a tu negocio funcionando.",
                ),
              },
            ]}
          />
        </div>

        {/* Cuatro pasos en fila (en celular, en columna), unidos por línea fina con scrub */}
        <ol
          ref={listRef}
          className="m-0 p-0 list-none grid grid-cols-1 lg:grid-cols-4 gap-0"
        >
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <li
                key={step.num}
                className="relative flex flex-col gap-4 pb-10 lg:pb-0 lg:pr-8 pl-7 lg:pl-0"
              >
                {/* Línea vertical en celular (track + progreso animado con scaleY) */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="lg:hidden absolute left-[7px] top-4 bottom-0 w-px bg-rosa-niebla/20 overflow-hidden"
                  >
                    <span
                      data-proc-line-v
                      className="block w-full h-full bg-esmeralda-clara origin-top will-change-transform"
                    />
                  </span>
                )}
                {/* Punto en la línea vertical para celular */}
                <span
                  aria-hidden="true"
                  className="lg:hidden absolute left-0 top-3 w-[15px] h-[15px] rounded-full border-2 border-esmeralda-clara bg-azul-tinta"
                />

                {/* Número grande en Bricolage esmeralda clara + línea horizontal en escritorio */}
                <div className="flex items-center gap-4">
                  <span
                    data-proc-num
                    className="font-bricolage font-extrabold text-[clamp(48px,5vw,84px)] text-esmeralda-clara leading-none tracking-[-0.03em] shrink-0"
                  >
                    {step.num}
                  </span>
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="hidden lg:block flex-1 h-[1.5px] bg-rosa-niebla/20 overflow-hidden"
                    >
                      <span
                        data-proc-line-h
                        className="block w-full h-full bg-esmeralda-clara origin-left will-change-transform"
                      />
                    </span>
                  )}
                </div>

                {/* Contenido del paso que aparece cuando la línea llega a él */}
                <div
                  data-proc-step
                  className="flex flex-col gap-3 will-change-transform"
                >
                  <h3 className="m-0 font-bricolage font-extrabold text-[clamp(22px,1.8vw,32px)] text-rosa-niebla tracking-[-0.02em] leading-[1.12]">
                    {step.title}
                  </h3>

                  <p className="m-0 text-[clamp(16px,1.1vw,19px)] leading-[1.55] text-texto-azul">
                    {step.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Botón al final */}
        <div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[56px] px-7 rounded-[14px] bg-rosa-niebla hover:bg-blanco text-azul-tinta font-semibold text-[16px] sm:text-[17px] no-underline transition-colors"
          >
            {t("proceso.cta", "Empezar por el paso 1")}
          </a>
        </div>
      </div>
    </Section>
  );
};
