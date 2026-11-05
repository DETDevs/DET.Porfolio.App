import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollTo } from "@/shared/hooks/useLenis";
import { SectionTitle } from "@/shared/ui/MaskedTitle";

gsap.registerPlugin(ScrollTrigger);

export const Services = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const receiptPaperRef = useRef<HTMLDivElement>(null);
  const receiptTotalRef = useRef<HTMLSpanElement>(null);
  const receiptBadgeRef = useRef<HTMLDivElement>(null);
  const cobrosBarRef = useRef<HTMLDivElement>(null);
  const cobrosAmountRef = useRef<HTMLSpanElement>(null);
  const deliveryMaskPathRef = useRef<SVGPathElement>(null);
  const deliveryRoutePathRef = useRef<SVGPathElement>(null);
  const deliveryPulseRingRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(sectionEl.querySelectorAll(".bento-card"), {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
      if (receiptPaperRef.current) {
        gsap.set(receiptPaperRef.current, {
          clearProps: "all",
          clipPath: "inset(0% 0% 0% 0%)",
        });
      }
      gsap.set(sectionEl.querySelectorAll(".receipt-line-item"), {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
      if (receiptTotalRef.current) {
        receiptTotalRef.current.textContent = "C$295";
      }
      if (receiptBadgeRef.current) {
        gsap.set(receiptBadgeRef.current, {
          clearProps: "all",
          opacity: 1,
          scale: 1,
        });
      }
      if (cobrosBarRef.current) {
        gsap.set(cobrosBarRef.current, { clearProps: "all", scaleX: 1 });
      }
      if (cobrosAmountRef.current) {
        cobrosAmountRef.current.textContent = "− C$1,500";
      }
      gsap.set(sectionEl.querySelectorAll("[data-citas-active='true']"), {
        clearProps: "all",
        opacity: 1,
        scale: 1,
      });
      if (deliveryMaskPathRef.current) {
        gsap.set(deliveryMaskPathRef.current, { strokeDashoffset: 0 });
      }
      if (deliveryRoutePathRef.current) {
        gsap.set(deliveryRoutePathRef.current, { strokeDashoffset: 0 });
      }
      if (deliveryPulseRingRef.current) {
        gsap.set(deliveryPulseRingRef.current, {
          clearProps: "all",
          scale: 1,
          opacity: 1,
        });
      }
      gsap.set(sectionEl.querySelectorAll("[data-web-part]"), {
        clearProps: "all",
        opacity: 1,
        y: 0,
        scaleX: 1,
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Entrada escalonada de las 5 tarjetas del bento (32 px y opacidad)
      const cards = gsap.utils.toArray<HTMLElement>(
        sectionEl.querySelectorAll(".bento-card"),
      );
      gsap.set(cards, { opacity: 0, y: 32 });

      gsap.to(cards, {
        scrollTrigger: {
          trigger: sectionEl.querySelector(".bento-grid"),
          start: "top 82%",
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(cards, { clearProps: "transform" });
        },
      });

      // 2. Comprobante de NEXOL POS (~2.0s total):
      // sale de la impresora con clip-path de arriba abajo, renglones uno por uno,
      // total sube contando de C$0 a C$295, y al final aparece "Inventario descontado" con rebote.
      const receiptEl = receiptPaperRef.current;
      const lineItems = gsap.utils.toArray<HTMLElement>(
        sectionEl.querySelectorAll(".receipt-line-item"),
      );
      const badgeEl = receiptBadgeRef.current;
      const totalEl = receiptTotalRef.current;

      if (receiptEl && totalEl && badgeEl) {
        gsap.set(receiptEl, {
          clipPath: "inset(0% 0% 100% 0%)",
          y: -12,
        });
        gsap.set(lineItems, { opacity: 0, y: 6 });
        gsap.set(badgeEl, { opacity: 0, scale: 0.72 });
        totalEl.textContent = "C$0";

        const totalCounter = { val: 0 };
        const receiptTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#svc-pos",
            start: "top 78%",
            once: true,
          },
        });

        receiptTl
          .to(
            receiptEl,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              duration: 0.72,
              ease: "power3.out",
            },
            0,
          )
          .to(
            lineItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.36,
              stagger: 0.1,
              ease: "power3.out",
            },
            0.45,
          )
          .to(
            totalCounter,
            {
              val: 295,
              duration: 0.65,
              ease: "power3.out",
              onUpdate: () => {
                totalEl.textContent = `C$${Math.round(totalCounter.val)}`;
              },
            },
            1.02,
          )
          .to(
            badgeEl,
            {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              ease: "back.out(2.2)",
            },
            1.55,
          );
      }

      // 3. NEXOL Cobros: barra de 0 al 66% con scaleX y monto contando hacia arriba
      const cobrosBar = cobrosBarRef.current;
      const cobrosAmt = cobrosAmountRef.current;
      if (cobrosBar && cobrosAmt) {
        gsap.set(cobrosBar, { scaleX: 0, transformOrigin: "left center" });
        cobrosAmt.textContent = "− C$0";
        const cobrosCounter = { val: 0 };

        const cobrosTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#svc-cobros",
            start: "top 82%",
            once: true,
          },
        });

        cobrosTl
          .to(
            cobrosBar,
            {
              scaleX: 1,
              duration: 0.85,
              ease: "expo.out",
            },
            0.15,
          )
          .to(
            cobrosCounter,
            {
              val: 1500,
              duration: 0.85,
              ease: "power3.out",
              onUpdate: () => {
                const rounded = Math.round(cobrosCounter.val);
                cobrosAmt.textContent = `− C$${rounded.toLocaleString("en-US")}`;
              },
            },
            0.15,
          );
      }

      // 4. NEXOL Citas: las casillas de la mini agenda se marcan en orden aleatorio, una cada 0.07s
      const citasSlots = gsap.utils.toArray<HTMLElement>(
        sectionEl.querySelectorAll("[data-citas-active='true']"),
      );
      if (citasSlots.length > 0) {
        const randomOrder = [2, 0, 5, 1, 4, 3]
          .map((i) => citasSlots[i])
          .filter(Boolean);
        gsap.set(randomOrder, { scale: 0.35, opacity: 0.15 });

        gsap.to(randomOrder, {
          scrollTrigger: {
            trigger: "#svc-citas",
            start: "top 84%",
            once: true,
          },
          scale: 1,
          opacity: 1,
          duration: 0.42,
          stagger: 0.07,
          ease: "back.out(1.8)",
        });
      }

      // 5. NEXOL Delivery: ruta punteada se dibuja con stroke-dashoffset;
      // punto de destino late suavemente SOLO mientras la tarjeta está en pantalla.
      const maskPath = deliveryMaskPathRef.current;
      const routePath = deliveryRoutePathRef.current;
      const pulseRing = deliveryPulseRingRef.current;

      if (maskPath && routePath) {
        gsap.set(maskPath, { strokeDasharray: 200, strokeDashoffset: 200 });
        gsap.set(routePath, { strokeDashoffset: 40 });

        const routeTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#svc-delivery",
            start: "top 85%",
            once: true,
          },
        });

        routeTl
          .to(
            maskPath,
            {
              strokeDashoffset: 0,
              duration: 0.85,
              ease: "power3.out",
            },
            0.15,
          )
          .to(
            routePath,
            {
              strokeDashoffset: 0,
              duration: 0.85,
              ease: "power3.out",
            },
            0.15,
          );
      }

      if (pulseRing) {
        const pulseTween = gsap.to(pulseRing, {
          scale: 1.45,
          opacity: 0.25,
          transformOrigin: "center center",
          duration: 0.85,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
        });

        ScrollTrigger.create({
          trigger: "#svc-delivery",
          start: "top bottom",
          end: "bottom top",
          onEnter: () => pulseTween.play(),
          onEnterBack: () => pulseTween.play(),
          onLeave: () => pulseTween.pause(),
          onLeaveBack: () => pulseTween.pause(),
        });
      }

      // 6. Web y a la medida: la mini ventana se arma por partes (barra, título, línea y botón)
      const webParts = gsap.utils.toArray<HTMLElement>(
        sectionEl.querySelectorAll("[data-web-part]"),
      );
      if (webParts.length > 0) {
        gsap.set(webParts, {
          opacity: 0,
          y: 8,
          scaleX: 0.75,
          transformOrigin: "left center",
        });

        gsap.to(webParts, {
          scrollTrigger: {
            trigger: "#svc-web",
            start: "top 85%",
            once: true,
          },
          opacity: 1,
          y: 0,
          scaleX: 1,
          duration: 0.48,
          stagger: 0.1,
          ease: "power3.out",
        });
      }
    });

    return () => mm.revert();
  }, []);

  const handleNavigatePlan = (category: string) => {
    window.dispatchEvent(
      new CustomEvent("select-pricing-tab", { detail: category }),
    );
    scrollTo("#planes", { offset: -80, duration: 1.2 });
  };

  return (
    <section
      ref={sectionRef}
      id="servicios"
      aria-labelledby="svc-titulo"
      className="relative w-full bg-azul-tinta text-rosa-niebla py-[clamp(72px,9vw,160px)] scroll-mt-20 overflow-hidden"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] box-border flex flex-col gap-12">
        {/* Encabezado de la sección */}
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="flex flex-col gap-4 max-w-[900px]">
            <p className="m-0 font-mono text-[13px] tracking-[0.06em] text-esmeralda-clara">
              {t("services.eyebrow", "Lo que hacemos por tu negocio")}
            </p>
            <SectionTitle
              id="svc-titulo"
              className="m-0 font-bricolage font-semibold text-[clamp(36px,4.6vw,80px)] text-rosa-niebla tracking-[-0.035em] leading-[0.98]"
              segments={[
                {
                  text: t(
                    "services.title_prefix",
                    "Software hecho aquí, para los negocios ",
                  ),
                },
                {
                  text: t("services.title_highlight", "de aquí."),
                  className: "font-extrabold text-esmeralda-clara",
                },
              ]}
            />
          </div>
          <p className="m-0 max-w-[400px] text-[clamp(16px,1.1vw,19px)] leading-[1.55] text-texto-azul">
            {t(
              "services.subtitle",
              "Cinco servicios que podés usar juntos o por separado. Instalación, capacitación y soporte incluidos.",
            )}
          </p>
        </div>

        {/* Cuadrícula tipo Bento de 6 columnas con gap de 14px */}
        <div className="bento-grid grid grid-cols-1 md:grid-cols-6 gap-[14px]">
          {/* ========================================================= */}
          {/* 1. NEXOL POS: 4 cols × 2 rows (Fondo Rosa Niebla)         */}
          {/* ========================================================= */}
          <article
            id="svc-pos"
            className="bento-card bento-hover-card md:col-span-4 md:row-span-2 bg-rosa-niebla text-azul-tinta rounded-[24px] p-7 sm:p-9 lg:p-10 flex flex-wrap items-center gap-7 scroll-mt-24"
          >
            {/* Información izquierda */}
            <div className="flex-[999_1_280px] min-w-0 flex flex-col gap-4">
              <span className="font-mono text-[13px] text-texto-secundario-muted">
                {t("services.cards.pos.tag", "01 · Punto de venta")}
              </span>
              <h3 className="m-0 font-bricolage font-extrabold text-[clamp(32px,3vw,52px)] leading-none tracking-[-0.03em] text-azul-tinta">
                {t("services.cards.pos.title", "NEXOL POS")}
              </h3>
              <p className="m-0 text-[clamp(16px,1.1vw,19px)] leading-[1.5] text-texto-secundario">
                {t(
                  "services.cards.pos.desc",
                  "Cobro rápido con pagos mixtos y dólares, cierre de caja por turno, inventario y reportes. Para tiendas, farmacias, restaurantes y talleres.",
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="py-2 px-3.5 rounded-full bg-azul-tinta text-rosa-niebla font-mono text-[13px]">
                  {t("services.cards.pos.price", "$45 / mes por sucursal")}
                </span>
                <button
                  type="button"
                  onClick={() => handleNavigatePlan("pos")}
                  className="inline-flex items-center min-h-[44px] font-semibold text-[15px] text-azul-tinta hover:text-esmeralda-oscura underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer transition-colors"
                >
                  {t("services.cards.pos.cta", "Ver plan →")}
                </button>
              </div>
            </div>

            {/* Comprobante de ejemplo inclinado */}
            <div
              role="img"
              aria-label={t(
                "services.cards.pos.receipt_alt",
                "Ejemplo de comprobante de NEXOL POS",
              )}
              className="flex-[1_0_240px] lg:flex-[1_0_300px] min-w-0 flex justify-center"
            >
              <div
                ref={receiptPaperRef}
                className="w-[240px] lg:w-[300px] max-w-full bg-blanco rounded-[6px] pt-[20px] px-[18px] pb-[22px] shadow-[0_18px_36px_rgba(29,43,92,0.22)] -rotate-3 hover:rotate-0 transition-transform duration-300 font-mono text-[12px] text-azul-tinta box-border select-none will-change-transform"
              >
                <div className="receipt-line-item">
                  <p className="m-0 text-center font-medium text-[13px]">
                    CAFETERÍA LA ESQUINA
                  </p>
                  <p className="mt-[3px] mb-0 text-center text-texto-secundario-muted">
                    Comprobante #00218
                  </p>
                </div>
                <div className="border-t border-dashed border-borde-campo my-3" />
                <div className="receipt-line-item flex justify-between">
                  <span>Café con leche ×2</span>
                  <span>C$120</span>
                </div>
                <div className="receipt-line-item flex justify-between mt-[5px]">
                  <span>Nacatamal ×1</span>
                  <span>C$95</span>
                </div>
                <div className="receipt-line-item flex justify-between mt-[5px]">
                  <span>Refresco ×2</span>
                  <span>C$80</span>
                </div>
                <div className="border-t border-dashed border-borde-campo my-3" />
                <div className="receipt-line-item flex justify-between font-medium text-[14px]">
                  <span>TOTAL</span>
                  <span ref={receiptTotalRef}>C$295</span>
                </div>
                <div
                  ref={receiptBadgeRef}
                  className="mt-3 inline-flex items-center gap-1.5 py-1 px-2 rounded-[6px] bg-badge-verde-bg text-badge-verde-text text-[12px] origin-left"
                >
                  <span
                    aria-hidden="true"
                    className="w-[7px] h-[7px] rounded-full bg-esmeralda"
                  />
                  Inventario descontado
                </div>
              </div>
            </div>
          </article>

          {/* ========================================================= */}
          {/* 2. NEXOL Cobros: 2 cols (Azul Claro)                      */}
          {/* ========================================================= */}
          <article
            id="svc-cobros"
            className="bento-card bento-hover-card md:col-span-2 bg-azul-tinta-claro rounded-[24px] p-[26px] lg:p-8 flex flex-col gap-3.5 scroll-mt-24"
          >
            <span className="font-mono text-[13px] text-texto-azul-muted">
              {t("services.cards.cobros.tag", "02 · Cartera de cobro")}
            </span>
            <h3 className="m-0 font-bricolage font-extrabold text-[clamp(22px,1.8vw,32px)] tracking-[-0.02em] text-rosa-niebla leading-tight">
              {t("services.cards.cobros.title", "NEXOL Cobros")}
            </h3>
            <p className="m-0 text-[15px] leading-[1.5] text-texto-azul">
              {t(
                "services.cards.cobros.desc",
                "Clientes, cuotas y abonos en orden, con el saldo siempre al día.",
              )}
            </p>

            {/* Barra de progreso con scaleX (sin animar width) */}
            <div
              aria-hidden="true"
              className="mt-auto flex flex-col gap-1.5 font-mono text-[12px] text-texto-azul"
            >
              <div className="flex justify-between">
                <span>Abono 01</span>
                <span ref={cobrosAmountRef} className="text-esmeralda-clara">
                  − C$1,500
                </span>
              </div>
              <div className="h-[6px] rounded-[6px] bg-rosa-niebla/18 overflow-hidden">
                <div
                  ref={cobrosBarRef}
                  className="w-[66%] h-[6px] rounded-[6px] bg-esmeralda-clara origin-left will-change-transform"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[13px] text-rosa-niebla">
                {t("services.cards.cobros.price", "$25 / mes")}
              </span>
              <button
                type="button"
                onClick={() => handleNavigatePlan("cartera")}
                className="font-mono text-[12px] font-medium text-texto-azul-muted hover:text-esmeralda-clara bg-transparent border-0 p-0 cursor-pointer transition-colors"
              >
                {t("services.cards.cobros.cta", "Ver plan →")}
              </button>
            </div>
          </article>

          {/* ========================================================= */}
          {/* 3. NEXOL Citas: 2 cols (Azul Claro)                       */}
          {/* ========================================================= */}
          <article
            id="svc-citas"
            className="bento-card bento-hover-card md:col-span-2 bg-azul-tinta-claro rounded-[24px] p-[26px] lg:p-8 flex flex-col gap-3.5 scroll-mt-24"
          >
            <span className="font-mono text-[13px] text-texto-azul-muted">
              {t("services.cards.citas.tag", "03 · Agenda de citas")}
            </span>
            <h3 className="m-0 font-bricolage font-extrabold text-[clamp(22px,1.8vw,32px)] tracking-[-0.02em] text-rosa-niebla leading-tight">
              {t("services.cards.citas.title", "NEXOL Citas")}
            </h3>
            <p className="m-0 text-[15px] leading-[1.5] text-texto-azul">
              {t(
                "services.cards.citas.desc",
                "Reservas en línea por profesional y servicio, con confirmación automática.",
              )}
            </p>

            {/* Mini cuadrícula decorativa: casillas activas se marcan en orden aleatorio */}
            <div
              aria-hidden="true"
              className="mt-auto grid grid-cols-5 gap-[5px]"
            >
              <span
                data-citas-active="true"
                className="h-[14px] rounded-[4px] bg-esmeralda-clara will-change-transform"
              />
              <span className="h-[14px] rounded-[4px] bg-rosa-niebla/18" />
              <span
                data-citas-active="true"
                className="h-[14px] rounded-[4px] bg-esmeralda-clara will-change-transform"
              />
              <span className="h-[14px] rounded-[4px] bg-rosa-niebla/18" />
              <span
                data-citas-active="true"
                className="h-[14px] rounded-[4px] bg-esmeralda-clara will-change-transform"
              />
              <span className="h-[14px] rounded-[4px] bg-rosa-niebla/18" />
              <span
                data-citas-active="true"
                className="h-[14px] rounded-[4px] bg-esmeralda-clara will-change-transform"
              />
              <span className="h-[14px] rounded-[4px] bg-rosa-niebla/18" />
              <span
                data-citas-active="true"
                className="h-[14px] rounded-[4px] bg-esmeralda-clara will-change-transform"
              />
              <span
                data-citas-active="true"
                className="h-[14px] rounded-[4px] bg-esmeralda-clara will-change-transform"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[13px] text-rosa-niebla">
                {t("services.cards.citas.price", "$30 / mes")}
              </span>
              <button
                type="button"
                onClick={() => handleNavigatePlan("citas")}
                className="font-mono text-[12px] font-medium text-texto-azul-muted hover:text-esmeralda-clara bg-transparent border-0 p-0 cursor-pointer transition-colors"
              >
                {t("services.cards.citas.cta", "Ver plan →")}
              </button>
            </div>
          </article>

          {/* ========================================================= */}
          {/* 4. NEXOL Delivery: 3 cols (Solo borde)                    */}
          {/* ========================================================= */}
          <article
            id="svc-delivery"
            className="bento-card bento-hover-card md:col-span-3 border border-rosa-niebla/28 rounded-[24px] p-[26px] lg:p-8 flex flex-wrap items-center gap-5 scroll-mt-24"
          >
            <div className="flex-[999_1_220px] min-w-0 flex flex-col gap-3">
              <span className="font-mono text-[13px] text-texto-azul-muted">
                {t("services.cards.delivery.tag", "04 · Logística")}
              </span>
              <h3 className="m-0 font-bricolage font-extrabold text-[clamp(22px,1.8vw,32px)] tracking-[-0.02em] text-rosa-niebla leading-tight">
                {t("services.cards.delivery.title", "NEXOL Delivery")}
              </h3>
              <p className="m-0 text-[15px] leading-[1.5] text-texto-azul">
                {t(
                  "services.cards.delivery.desc",
                  "Pedidos, repartidores con mapa en vivo y seguimiento para tu cliente. Pagás por entrega, sin mensualidad.",
                )}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleNavigatePlan("logistics")}
                  className="font-mono text-[12px] font-medium text-texto-azul-muted hover:text-esmeralda-clara bg-transparent border-0 p-0 cursor-pointer transition-colors"
                >
                  {t("services.cards.delivery.cta", "Ver plan →")}
                </button>
              </div>
            </div>

            <svg
              aria-hidden="true"
              width="150"
              height="90"
              viewBox="0 0 150 90"
              fill="none"
              className="shrink-0 text-esmeralda-clara overflow-visible"
            >
              <defs>
                <mask id="delivery-route-mask">
                  <path
                    ref={deliveryMaskPathRef}
                    d="M12 76 C 50 76, 40 20, 82 30 S 120 14, 138 12"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </mask>
              </defs>
              <path
                ref={deliveryRoutePathRef}
                d="M12 76 C 50 76, 40 20, 82 30 S 120 14, 138 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 6"
                mask="url(#delivery-route-mask)"
              />
              <circle cx="12" cy="76" r="7" className="fill-rosa-niebla" />
              <circle
                ref={deliveryPulseRingRef}
                cx="138"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="138" cy="12" r="4" fill="currentColor" />
            </svg>
          </article>

          {/* ========================================================= */}
          {/* 5. Páginas web y sistemas propios: 3 cols (Solo borde)    */}
          {/* ========================================================= */}
          <article
            id="svc-web"
            className="bento-card bento-hover-card md:col-span-3 border border-rosa-niebla/28 rounded-[24px] p-[26px] lg:p-8 flex flex-wrap items-center gap-5 scroll-mt-24"
          >
            <div className="flex-[999_1_220px] min-w-0 flex flex-col gap-3">
              <span className="font-mono text-[13px] text-texto-azul-muted">
                {t("services.cards.web.tag", "05 · Web y a la medida")}
              </span>
              <h3 className="m-0 font-bricolage font-extrabold text-[clamp(22px,1.8vw,32px)] tracking-[-0.02em] text-rosa-niebla leading-tight">
                {t("services.cards.web.title", "Páginas web y sistemas propios")}
              </h3>
              <p className="m-0 text-[15px] leading-[1.5] text-texto-azul">
                {t(
                  "services.cards.web.desc",
                  "Tu página para vender más, o el sistema que tu negocio necesita y no existe.",
                )}
              </p>
              <div className="flex items-center gap-4 pt-1">
                <span className="font-mono text-[13px] text-rosa-niebla">
                  {t("services.cards.web.price", "Desde $300")}
                </span>
                <button
                  type="button"
                  onClick={() => handleNavigatePlan("web")}
                  className="font-mono text-[12px] font-medium text-texto-azul-muted hover:text-esmeralda-clara bg-transparent border-0 p-0 cursor-pointer transition-colors"
                >
                  {t("services.cards.web.cta", "Ver plan →")}
                </button>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="shrink-0 w-[150px] h-[92px] rounded-[10px] bg-rosa-niebla p-2 box-border flex flex-col gap-1.5"
            >
              <div data-web-part="bar" className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-azul-tinta" />
                <span className="w-1.5 h-1.5 rounded-full bg-azul-tinta" />
                <span className="w-1.5 h-1.5 rounded-full bg-azul-tinta" />
              </div>
              <div
                data-web-part="title"
                className="h-2.5 w-[70%] rounded-[3px] bg-azul-tinta"
              />
              <div
                data-web-part="line"
                className="h-1.5 w-[90%] rounded-[3px] bg-borde-campo"
              />
              <div
                data-web-part="btn"
                className="h-3.5 w-[40%] rounded-[4px] bg-esmeralda-oscura mt-auto"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
