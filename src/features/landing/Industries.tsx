import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/shared/ui/Section";
import { SectionTitle } from "@/shared/ui/MaskedTitle";

gsap.registerPlugin(ScrollTrigger);

interface IndustryItem {
  num: string;
  title: string;
  points: string[];
}

const DEFAULT_ITEMS: IndustryItem[] = [
  {
    num: "01",
    title: "Tiendas y supermercados",
    points: [
      "Lector de código de barras y venta con teclado",
      "Inventario con alerta de stock bajo y compras a proveedores",
      "Fiado con límite por cliente, cuotas y estado de cuenta",
      "Venta a granel con decimales",
    ],
  },
  {
    num: "02",
    title: "Farmacias",
    points: [
      "Lotes y vencimientos, sale primero lo que vence antes",
      "Alertas de lo que vence en 30, 60 y 90 días",
      "Laboratorio, principio activo y aviso de receta en caja",
      "Venta en dos pasos, el vendedor arma y el cajero cobra",
    ],
  },
  {
    num: "03",
    title: "Restaurantes y cafeterías",
    points: [
      "Zonas y mesas con meseros",
      "Comanda impresa en cocina por cada ronda",
      "Recetas que descuentan sus ingredientes al vender",
      "Cuenta dividida en partes iguales o por plato",
    ],
  },
  {
    num: "04",
    title: "Talleres",
    points: [
      "Vehículo por placa con su kilometraje",
      "Historial de cada trabajo hecho al vehículo",
      "Órdenes con repuestos y mano de obra",
      "Técnico asignado a cada orden",
    ],
  },
];

export const Industries = () => {
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);

  const rawItems = t("rubros.items", { returnObjects: true });
  const items = (
    Array.isArray(rawItems) && rawItems.length === 4 ? rawItems : DEFAULT_ITEMS
  ) as IndustryItem[];

  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(gridEl.querySelectorAll(".rubro-card"), {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        gridEl.querySelectorAll(".rubro-card"),
      );
      gsap.set(cards, { opacity: 0, y: 28 });

      gsap.to(cards, {
        scrollTrigger: {
          trigger: gridEl,
          start: "top 84%",
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(cards, { clearProps: "transform" });
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <Section
      id="rubros"
      aria-labelledby="rubros-titulo"
      sectionClassName="bg-rosa-niebla text-azul-tinta overflow-hidden"
    >
      <div className="flex flex-col gap-12 lg:gap-14">
        {/* Encabezado */}
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="flex flex-col gap-4 max-w-[920px]">
            <p className="m-0 font-mono text-[13px] tracking-[0.06em] text-esmeralda-oscura">
              {t("rubros.eyebrow", "NEXOL POS por rubro")}
            </p>
            <SectionTitle
              id="rubros-titulo"
              className="m-0 font-bricolage text-[clamp(36px,4.6vw,80px)] font-extrabold text-azul-tinta tracking-[-0.035em] leading-[1.02]"
              segments={[
                {
                  text: t("rubros.title_prefix", "Lo mismo de siempre, "),
                },
                {
                  text: t("rubros.title_sub", "ajustado a tu negocio."),
                  className: "font-normal text-texto-secundario",
                },
              ]}
            />
          </div>
          <p className="m-0 max-w-[420px] text-[clamp(16px,1.1vw,19px)] leading-[1.55] text-texto-secundario">
            {t(
              "rubros.subtitle",
              "El mismo sistema se adapta a cómo vende cada comercio.",
            )}
          </p>
        </div>

        {/* Cuadrícula de 4 tarjetas */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {items.map((item) => (
            <article
              key={item.num}
              className="rubro-card rubro-hover-card bg-blanco text-azul-tinta border-[1.5px] border-transparent rounded-[24px] p-7 sm:p-8 flex flex-col gap-5 shadow-2xs"
            >
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-xs text-texto-secundario-muted">
                  {item.num}
                </span>
                <h3 className="m-0 font-bricolage font-extrabold text-[clamp(22px,1.8vw,32px)] text-azul-tinta tracking-[-0.025em] leading-[1.1]">
                  {item.title}
                </h3>
              </div>

              <ul className="m-0 p-0 list-none flex flex-col gap-3 text-[15px] leading-[1.5] text-texto-secundario">
                {item.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="w-[7px] h-[7px] rounded-full bg-esmeralda mt-[7px] shrink-0"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Enlace debajo de las tarjetas */}
        <div>
          <a
            href="https://pos.nexolsoft.com"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center min-h-[48px] font-semibold text-[clamp(16px,1.1vw,19px)] text-azul-tinta hover:text-esmeralda-oscura underline underline-offset-4 transition-colors"
          >
            {t("rubros.cta", "Ver NEXOL POS para tu rubro →")}
          </a>
        </div>
      </div>
    </Section>
  );
};
