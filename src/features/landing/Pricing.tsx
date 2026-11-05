import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  Maximize2,
  Minimize2,
  ArrowRight,
  Calendar,
  Monitor,
  Receipt,
  Truck,
  Printer,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import { CONTACT_INFO } from "@/config/constants";
import { SectionTitle } from "@/shared/ui/MaskedTitle";

type CategoryId = "web" | "pos" | "citas" | "cartera" | "logistics";

const CATEGORIES: {
  id: CategoryId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "web", label: "Páginas web", icon: Monitor },
  { id: "pos", label: "Punto de venta", icon: Receipt },
  { id: "citas", label: "Citas / booking", icon: Calendar },
  { id: "cartera", label: "Cartera de cobro", icon: Wallet },
  { id: "logistics", label: "Logística y delivery", icon: Truck },
];

const POS_MONTHLY_PRICE = 45;
const CITAS_MONTHLY_PRICE = 30;
const CARTERA_MONTHLY_PRICE = 25;
const WEB_STARTER_PRICE = 300;
const WEB_MAINTENANCE_PRICE = 30;

const POS_SHOWCASE_IMAGES = [
  {
    src: "/assets/project/pos/caja_POS.png",
    title: "Toma de órdenes y comprobantes",
    desc: "Interfaz ágil con soporte para múltiples métodos de pago y cálculo de vuelto.",
  },
  {
    src: "/assets/project/pos/historial_POS.png",
    title: "Control de caja y auditoría",
    desc: "Registro detallado de transacciones, cierres de turno y movimientos de efectivo.",
  },
  {
    src: "/assets/project/DulcesMomentos/project.png",
    title: "Catálogo e inventario real",
    desc: "Organización por categorías con búsqueda instantánea y control de existencias.",
  },
];

export const Pricing = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] = useState<CategoryId>("pos");
  const [selectedPosImage, setSelectedPosImage] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleSelectTab = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const detail = customEvent.detail;
      if (
        detail === "web" ||
        detail === "pos" ||
        detail === "citas" ||
        detail === "cartera" ||
        detail === "logistics"
      ) {
        setActiveCategory(detail);
      }
    };

    window.addEventListener("select-pricing-tab", handleSelectTab);
    return () =>
      window.removeEventListener("select-pricing-tab", handleSelectTab);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    if (lightboxImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (index + 1) % CATEGORIES.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = CATEGORIES.length - 1;
    } else {
      return;
    }
    setActiveCategory(CATEGORIES[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const getWhatsAppLink = (message: string) => {
    const cleanPhone = CONTACT_INFO.phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const panelMotionProps = {
    initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0 },
    animate: { opacity: 1 },
    exit: shouldReduceMotion ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" as const },
  };

  return (
    <Section
      id="planes"
      aria-labelledby="plan-titulo"
      sectionClassName="bg-rosa-niebla text-azul-tinta relative overflow-hidden"
    >
      <div className="relative z-10 w-full flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3.5">
          <p className="m-0 font-mono text-[13px] tracking-[0.06em] text-esmeralda-oscura">
            {t("pricing.eyebrow", "Inversión")}
          </p>
          <SectionTitle
            id="plan-titulo"
            className="m-0 font-bricolage text-[clamp(36px,4.6vw,80px)] font-extrabold text-azul-tinta tracking-[-0.035em] leading-[0.98]"
            segments={[
              {
                text: t("pricing.title", "Planes transparentes."),
              },
            ]}
          />
          <p className="m-0 text-texto-secundario text-[clamp(16px,1.1vw,19px)] max-w-[620px] leading-[1.55]">
            {t(
              "pricing.subtitle",
              "Soluciones claras y adaptadas a la etapa de tu negocio, sin costos sorpresa.",
            )}
          </p>
        </div>

        {/* Cápsula blanca de pestañas con fondo activo deslizable */}
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="Planes por servicio"
            className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-[16px] bg-blanco shadow-2xs"
          >
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${cat.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${cat.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveCategory(cat.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`relative flex items-center gap-2 min-h-[44px] px-4 rounded-[12px] text-sm transition-colors duration-150 cursor-pointer border-0 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-oscura ${
                    isActive
                      ? "text-rosa-niebla font-semibold"
                      : "text-azul-tinta hover:bg-azul-tinta/5 font-medium"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pricing-active-tab-pill"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      className="absolute inset-0 rounded-[12px] bg-azul-tinta z-0"
                    />
                  )}
                  <Icon
                    className={`relative z-10 w-4 h-4 ${
                      isActive
                        ? "text-esmeralda-clara"
                        : "text-texto-secundario-muted"
                    }`}
                  />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paneles de cada categoría (fundido de 0.25 s) */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {/* ================================================================= */}
            {/* PESTAÑA 1: PÁGINAS WEB                                            */}
            {/* ================================================================= */}
            {activeCategory === "web" && (
              <motion.div
                key="web"
                role="tabpanel"
                id="panel-web"
                aria-labelledby="tab-web"
                {...panelMotionProps}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
              >
                {/* Tarjeta del plan (Azul Tinta) */}
                <div className="lg:col-span-7 bg-azul-tinta text-rosa-niebla rounded-[24px] p-7 sm:p-9 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[13px] text-esmeralda-clara">
                        Presencia digital
                      </span>
                      <span className="font-mono text-xs text-texto-azul-muted">
                        Entrega en 1–3 semanas
                      </span>
                    </div>

                    <h3 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-rosa-niebla tracking-[-0.03em] leading-none">
                      Tu sitio web profesional
                    </h3>
                    <p className="m-0 text-texto-azul text-[16px] leading-[1.5]">
                      {t(
                        "pricing.web.desc",
                        "Todo lo que necesitás para vender en línea y recibir clientes con una imagen seria y moderna.",
                      )}
                    </p>

                    {/* Precio */}
                    <div className="py-4 border-y border-rosa-niebla/20 flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="font-mono text-xs text-texto-azul-muted">
                          Desde
                        </span>
                        <span className="font-bricolage text-5xl sm:text-[64px] font-extrabold text-rosa-niebla leading-none tracking-[-0.04em]">
                          ${WEB_STARTER_PRICE}
                        </span>
                        <span className="text-[15px] text-texto-azul">
                          pago único
                        </span>
                      </div>
                      <p className="m-0 font-mono text-xs text-texto-azul-muted flex items-center gap-1.5">
                        <span className="text-esmeralda-clara font-bold">✓</span>
                        <span>
                          + ${WEB_MAINTENANCE_PRICE}/mes tras 2 meses de soporte incluidos
                        </span>
                      </p>
                    </div>

                    {/* Lista de alcance */}
                    <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[15px] leading-[1.45] text-texto-azul">
                      {[
                        "Diseño a medida moderno, limpio y 100% adaptable (celular, tablet y computadora).",
                        "Formulario de contacto estructurado con enlace directo a WhatsApp.",
                        "Optimización de velocidad y posicionamiento en buscadores (SEO).",
                        "Entrega rápida garantizada en 1 a 3 semanas.",
                        "2 meses de soporte técnico y mantenimiento preventivo incluidos.",
                      ].map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="text-esmeralda-clara font-bold shrink-0"
                          >
                            ✓
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={getWhatsAppLink(
                      "Hola NEXOL, me interesa cotizar un sitio web profesional para mi negocio.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center justify-center gap-2 min-h-[52px] px-[26px] rounded-[12px] bg-rosa-niebla hover:bg-blanco text-azul-tinta font-semibold text-[16px] no-underline transition-colors mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Solicitar mi sitio web</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Tarjeta lateral blanca */}
                <div className="lg:col-span-5 bg-blanco text-azul-tinta rounded-[24px] p-6 sm:p-8 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-3.5">
                    <span className="font-mono text-[13px] text-esmeralda-oscura">
                      Garantía y mantenimiento
                    </span>
                    <h4 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-azul-tinta tracking-tight leading-tight">
                      Tu sitio siempre disponible
                    </h4>
                    <p className="m-0 text-texto-secundario text-sm leading-relaxed">
                      No desaparecemos después de entregar. Nuestro soporte se
                      asegura de que tu plataforma funcione de manera
                      ininterrumpida.
                    </p>

                    <div className="flex flex-col gap-3 pt-1">
                      {[
                        {
                          title: "Monitoreo de infraestructura",
                          desc: "Supervisión de servidores, certificados SSL y disponibilidad 24/7.",
                        },
                        {
                          title: "Respaldos en la nube",
                          desc: "Copias de seguridad semanales para resguardar toda la información.",
                        },
                        {
                          title: "Soporte técnico continuo",
                          desc: "Ajustes de contenidos, actualización de catálogos y asistencia vía WhatsApp.",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-[14px] bg-rosa-niebla/65 flex flex-col gap-1"
                        >
                          <div className="font-semibold text-sm text-azul-tinta flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="w-2 h-2 rounded-full bg-esmeralda shrink-0"
                            />
                            {item.title}
                          </div>
                          <p className="m-0 text-xs text-texto-secundario leading-relaxed pl-4">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-azul-tinta/15 text-xs text-texto-secundario-muted font-mono text-center">
                    Código limpio y de tu propiedad. Sin letra chica.
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================================================================= */}
            {/* PESTAÑA 2: PUNTO DE VENTA (NEXOL POS)                             */}
            {/* ================================================================= */}
            {activeCategory === "pos" && (
              <motion.div
                key="pos"
                role="tabpanel"
                id="panel-pos"
                aria-labelledby="tab-pos"
                {...panelMotionProps}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
              >
                {/* Tarjeta del plan (Azul Tinta) */}
                <div className="lg:col-span-7 bg-azul-tinta text-rosa-niebla rounded-[24px] p-7 sm:p-9 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[13px] text-esmeralda-clara">
                      Un solo plan · todo incluido
                    </span>

                    <h3 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-rosa-niebla tracking-[-0.03em] leading-none">
                      NEXOL POS
                    </h3>
                    <p className="m-0 text-texto-azul text-[16px] leading-[1.5]">
                      Sin versiones recortadas ni escalones artificiales. Toda
                      la funcionalidad completa del punto de venta en una única
                      cuota mensual predecible.
                    </p>

                    {/* Precio */}
                    <div className="py-4 border-y border-rosa-niebla/20 flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bricolage text-5xl sm:text-[64px] font-extrabold text-rosa-niebla leading-none tracking-[-0.04em]">
                          ${POS_MONTHLY_PRICE}
                        </span>
                        <span className="text-[15px] text-texto-azul">
                          / mes por sucursal
                        </span>
                      </div>
                      <p className="m-0 font-mono text-xs text-texto-azul-muted flex items-center gap-2">
                        <span className="text-esmeralda-clara font-bold">✓</span>
                        <span>
                          Actualizaciones continuas, hosting y soporte técnico incluidos
                        </span>
                      </p>
                    </div>

                    {/* Capacidades incluidas */}
                    <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] leading-[1.45] text-texto-azul">
                      {[
                        "Cobro rápido con ticket térmico y comprobantes de venta.",
                        "Efectivo, tarjeta, transferencia, crédito y pago mixto (C$ y US$).",
                        "Control de caja: apertura y cierre de turno, cierre ciego y arqueo.",
                        "Anulaciones y devoluciones con autorización del encargado.",
                        "Inventario en tiempo real, compras a proveedores y alertas de stock.",
                        "Panel web de consulta (ventas, inventario y cierres de caja).",
                        "Usuarios con roles de cajero, mesero y encargado configurables.",
                        "Reportes de ventas y de productos de mayor rotación.",
                        "Sigue cobrando sin internet en negocios de una sola caja.",
                        "Impresoras térmicas ESC/POS y cajón de dinero integrados.",
                      ].map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="text-esmeralda-clara font-bold shrink-0"
                          >
                            ✓
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={getWhatsAppLink(
                      `Hola NEXOL, me interesa comenzar con NEXOL POS ($${POS_MONTHLY_PRICE}/mes).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center justify-center gap-2 min-h-[52px] px-[26px] rounded-[12px] bg-rosa-niebla hover:bg-blanco text-azul-tinta font-semibold text-[16px] no-underline transition-colors mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comenzar con NEXOL POS</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Tarjeta lateral blanca: Probado en producción real */}
                <div className="lg:col-span-5 bg-blanco text-azul-tinta rounded-[24px] p-5 sm:p-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[13px] text-esmeralda-oscura">
                        Probado en producción real
                      </span>
                      <a
                        href="https://pos.nexolsoft.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-rosa-niebla hover:bg-azul-tinta text-azul-tinta hover:text-rosa-niebla text-xs font-mono font-medium no-underline transition-colors"
                      >
                        NEXOL POS ↗
                      </a>
                    </div>

                    {/* Captura principal */}
                    <div className="relative rounded-[14px] overflow-hidden border border-azul-tinta/15 aspect-[16/10] bg-azul-profundo">
                      <img
                        src={POS_SHOWCASE_IMAGES[selectedPosImage].src}
                        alt={POS_SHOWCASE_IMAGES[selectedPosImage].title}
                        className="w-full h-full object-cover object-top"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxImage(
                            POS_SHOWCASE_IMAGES[selectedPosImage].src,
                          )
                        }
                        className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-azul-tinta/90 hover:bg-azul-tinta text-rosa-niebla font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer rounded-lg border-0"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-esmeralda-clara" />
                        <span>Ampliar</span>
                      </button>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-azul-tinta">
                        {POS_SHOWCASE_IMAGES[selectedPosImage].title}
                      </div>
                      <div className="text-xs text-texto-secundario mt-0.5">
                        {POS_SHOWCASE_IMAGES[selectedPosImage].desc}
                      </div>
                    </div>

                    {/* Miniaturas */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {POS_SHOWCASE_IMAGES.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPosImage(idx)}
                          aria-label={`Ver captura de ${item.title}`}
                          className={`rounded-[10px] overflow-hidden transition-all p-0.5 bg-rosa-niebla cursor-pointer ${
                            selectedPosImage === idx
                              ? "border-2 border-azul-tinta opacity-100"
                              : "border border-transparent opacity-65 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full aspect-[16/10] object-cover rounded-[7px]"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aviso de hardware */}
                  <div className="p-3.5 rounded-[12px] bg-rosa-niebla/70 flex items-center gap-3 text-xs text-azul-tinta">
                    <Printer className="w-4 h-4 text-esmeralda-oscura shrink-0" />
                    <span>
                      Compatible con impresoras térmicas USB/Red y gavetas de dinero RJ11.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================================================================= */}
            {/* PESTAÑA 3: CITAS / BOOKING                                        */}
            {/* ================================================================= */}
            {activeCategory === "citas" && (
              <motion.div
                key="citas"
                role="tabpanel"
                id="panel-citas"
                aria-labelledby="tab-citas"
                {...panelMotionProps}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
              >
                {/* Tarjeta del plan (Azul Tinta) */}
                <div className="lg:col-span-7 bg-azul-tinta text-rosa-niebla rounded-[24px] p-7 sm:p-9 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[13px] text-esmeralda-clara">
                        Agenda inteligente
                      </span>
                      <span className="font-mono text-xs text-texto-azul-muted">
                        Disponibilidad 24/7
                      </span>
                    </div>

                    <h3 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-rosa-niebla tracking-[-0.03em] leading-none">
                      NEXOL Citas
                    </h3>
                    <p className="m-0 text-texto-azul text-[16px] leading-[1.5]">
                      Reservas en línea 24/7 con cobro automático al finalizar
                      la cita — sin agenda de papel ni cobros pendientes por
                      recordar.
                    </p>

                    {/* Precio */}
                    <div className="py-4 border-y border-rosa-niebla/20 flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bricolage text-5xl sm:text-[64px] font-extrabold text-rosa-niebla leading-none tracking-[-0.04em]">
                          ${CITAS_MONTHLY_PRICE}
                        </span>
                        <span className="text-[15px] text-texto-azul">
                          / mes por negocio
                        </span>
                      </div>
                      <p className="m-0 font-mono text-xs text-texto-azul-muted flex items-center gap-2">
                        <span className="text-esmeralda-clara font-bold">✓</span>
                        <span>
                          Actualizaciones continuas, hosting y soporte técnico incluidos
                        </span>
                      </p>
                    </div>

                    {/* Lista de capacidades */}
                    <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[15px] leading-[1.45] text-texto-azul">
                      {[
                        "Portal público de reservas 24/7.",
                        "Selección de múltiples servicios en una sola cita.",
                        "Especialistas filtrados automáticamente según servicios elegidos.",
                        "Bloqueo temporal de horarios (sin dobles reservas).",
                        "Cobro automático al completar la cita.",
                        "Confirmación automática por correo y WhatsApp.",
                      ].map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="text-esmeralda-clara font-bold shrink-0"
                          >
                            ✓
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={getWhatsAppLink(
                      `Hola NEXOL, me interesa el sistema NEXOL Citas ($${CITAS_MONTHLY_PRICE}/mes).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center justify-center gap-2 min-h-[52px] px-[26px] rounded-[12px] bg-rosa-niebla hover:bg-blanco text-azul-tinta font-semibold text-[16px] no-underline transition-colors mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comenzar con NEXOL Citas</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Tarjeta lateral blanca */}
                <div className="lg:col-span-5 bg-blanco text-azul-tinta rounded-[24px] p-6 sm:p-8 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-3.5">
                    <span className="font-mono text-[13px] text-esmeralda-oscura">
                      Servicio continuo
                    </span>
                    <h4 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-azul-tinta tracking-tight leading-tight">
                      Qué incluye tu membresía
                    </h4>
                    <p className="m-0 text-texto-secundario text-sm leading-relaxed">
                      Todo lo necesario para que tu sistema funcione de manera
                      ininterrumpida y sin costos imprevistos.
                    </p>

                    <div className="flex flex-col gap-3 pt-1">
                      {[
                        {
                          title: "Soporte técnico continuo",
                          desc: "Asistencia directa, resolución de dudas y acompañamiento continuo vía WhatsApp.",
                        },
                        {
                          title: "Actualizaciones sin costo extra",
                          desc: "Nuevas mejoras de software, optimizaciones y parches automáticos sin cargos adicionales.",
                        },
                        {
                          title: "Hosting incluido",
                          desc: "Tu información en la nube, siempre disponible, sin pagar infraestructura aparte.",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-[14px] bg-rosa-niebla/65 flex flex-col gap-1"
                        >
                          <div className="font-semibold text-sm text-azul-tinta flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="w-2 h-2 rounded-full bg-esmeralda shrink-0"
                            />
                            {item.title}
                          </div>
                          <p className="m-0 text-xs text-texto-secundario leading-relaxed pl-4">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-azul-tinta/15 text-xs text-texto-secundario-muted font-mono text-center">
                    Instalación y capacitación inicial incluidas.
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================================================================= */}
            {/* PESTAÑA 4: CARTERA DE COBRO                                       */}
            {/* ================================================================= */}
            {activeCategory === "cartera" && (
              <motion.div
                key="cartera"
                role="tabpanel"
                id="panel-cartera"
                aria-labelledby="tab-cartera"
                {...panelMotionProps}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
              >
                {/* Tarjeta del plan (Azul Tinta) */}
                <div className="lg:col-span-7 bg-azul-tinta text-rosa-niebla rounded-[24px] p-7 sm:p-9 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[13px] text-esmeralda-clara">
                        Control financiero
                      </span>
                      <span className="font-mono text-xs text-texto-azul-muted">
                        Cuentas claras
                      </span>
                    </div>

                    <h3 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-rosa-niebla tracking-[-0.03em] leading-none">
                      NEXOL Cobros
                    </h3>
                    <p className="m-0 text-texto-azul text-[16px] leading-[1.5]">
                      Controlá el crédito de tus clientes y de las empresas con
                      convenio: cada consumo queda en su cuenta, con límite de
                      crédito y estado de cuenta listo para cobrar. Se acabó la
                      libreta.
                    </p>

                    {/* Precio */}
                    <div className="py-4 border-y border-rosa-niebla/20 flex flex-col gap-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bricolage text-5xl sm:text-[64px] font-extrabold text-rosa-niebla leading-none tracking-[-0.04em]">
                          ${CARTERA_MONTHLY_PRICE}
                        </span>
                        <span className="text-[15px] text-texto-azul">
                          / mes por negocio
                        </span>
                      </div>
                      <p className="m-0 font-mono text-xs text-texto-azul-muted flex items-center gap-2">
                        <span className="text-esmeralda-clara font-bold">✓</span>
                        <span>
                          Actualizaciones continuas, hosting y soporte técnico incluidos
                        </span>
                      </p>
                    </div>

                    {/* Lista de capacidades */}
                    <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[15px] leading-[1.45] text-texto-azul">
                      {[
                        "Ventas a crédito (fiado) por cliente, con historial conectado a la venta que lo originó.",
                        "Registro de abonos y pagos parciales con saldo al día.",
                        "Límite de crédito por persona y por empresa, con autorización del encargado.",
                        "Empresas y convenios: agrupá a tus clientes por empresa e identificalos con su carnet.",
                        "Estado de cuenta por empresa y por persona, exportable a Excel para planilla.",
                        "Cortes por quincena, mes o semana, y aplicación de pagos masivos.",
                      ].map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="text-esmeralda-clara font-bold shrink-0"
                          >
                            ✓
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={getWhatsAppLink(
                      `Hola NEXOL, me interesa el sistema NEXOL Cobros ($${CARTERA_MONTHLY_PRICE}/mes).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center justify-center gap-2 min-h-[52px] px-[26px] rounded-[12px] bg-rosa-niebla hover:bg-blanco text-azul-tinta font-semibold text-[16px] no-underline transition-colors mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comenzar con NEXOL Cobros</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Tarjeta lateral blanca */}
                <div className="lg:col-span-5 bg-blanco text-azul-tinta rounded-[24px] p-6 sm:p-8 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-3.5">
                    <span className="font-mono text-[13px] text-esmeralda-oscura">
                      Servicio continuo
                    </span>
                    <h4 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-azul-tinta tracking-tight leading-tight">
                      Qué incluye tu membresía
                    </h4>
                    <p className="m-0 text-texto-secundario text-sm leading-relaxed">
                      Todo lo necesario para que tu sistema funcione de manera
                      ininterrumpida y sin costos imprevistos.
                    </p>

                    <div className="flex flex-col gap-3 pt-1">
                      {[
                        {
                          title: "Soporte técnico continuo",
                          desc: "Asistencia directa, resolución de dudas y acompañamiento continuo vía WhatsApp.",
                        },
                        {
                          title: "Actualizaciones sin costo extra",
                          desc: "Nuevas mejoras de software, optimizaciones y parches automáticos sin cargos adicionales.",
                        },
                        {
                          title: "Hosting incluido",
                          desc: "Tu información en la nube, siempre disponible, sin pagar infraestructura aparte.",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-[14px] bg-rosa-niebla/65 flex flex-col gap-1"
                        >
                          <div className="font-semibold text-sm text-azul-tinta flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="w-2 h-2 rounded-full bg-esmeralda shrink-0"
                            />
                            {item.title}
                          </div>
                          <p className="m-0 text-xs text-texto-secundario leading-relaxed pl-4">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-azul-tinta/15 text-xs text-texto-secundario-muted font-mono text-center">
                    Se integra con NEXOL POS o funciona de forma independiente.
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================================================================= */}
            {/* PESTAÑA 5: LOGÍSTICA Y DELIVERY                                   */}
            {/* ================================================================= */}
            {activeCategory === "logistics" && (
              <motion.div
                key="logistics"
                role="tabpanel"
                id="panel-logistics"
                aria-labelledby="tab-logistics"
                {...panelMotionProps}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
              >
                {/* Tarjeta del plan (Azul Tinta) */}
                <div className="lg:col-span-7 bg-azul-tinta text-rosa-niebla rounded-[24px] p-7 sm:p-9 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[13px] text-esmeralda-clara">
                      Modelo flexible
                    </span>

                    <h3 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-rosa-niebla tracking-[-0.03em] leading-none">
                      NEXOL Delivery
                    </h3>

                    {/* Destacado de modelo */}
                    <div className="py-4 border-y border-rosa-niebla/20 flex flex-col gap-1.5">
                      <p className="m-0 font-bricolage text-xl sm:text-2xl font-bold text-rosa-niebla leading-snug">
                        “Modelo de comisión por entrega — sin costo fijo mensual,
                        solo pagás cuando tu negocio despacha.”
                      </p>
                      <p className="m-0 text-xs text-texto-azul-muted font-mono leading-relaxed">
                        Tarifa acordada por pedido entregado según el volumen de
                        tu operación. Si no despachás, no pagás.
                      </p>
                    </div>

                    {/* Lista de capacidades */}
                    <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[15px] leading-[1.45] text-texto-azul">
                      {[
                        "Despacho automático al repartidor más cercano o asignación manual.",
                        "Seguimiento GPS en tiempo real para tu cliente final (sin descargar apps).",
                        "App móvil para repartidores con telemetría en vivo y ruta optimizada.",
                        "Panel web administrativo para monitorear órdenes, tiempos y flota.",
                        "Liquidación automática y transparente de comisiones por entrega completada.",
                      ].map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="text-esmeralda-clara font-bold shrink-0"
                          >
                            ✓
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={getWhatsAppLink(
                      "Hola NEXOL, me interesa conversar sobre NEXOL Delivery (modelo por entrega).",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center justify-center gap-2 min-h-[52px] px-[26px] rounded-[12px] bg-rosa-niebla hover:bg-blanco text-azul-tinta font-semibold text-[16px] no-underline transition-colors mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Consultar por WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Tarjeta lateral blanca */}
                <div className="lg:col-span-5 bg-blanco text-azul-tinta rounded-[24px] p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3.5">
                    <span className="font-mono text-[13px] text-esmeralda-oscura">
                      A tu medida
                    </span>
                    <h4 className="m-0 font-bricolage text-[clamp(22px,1.8vw,32px)] font-extrabold text-azul-tinta tracking-tight leading-tight">
                      Agendar una llamada
                    </h4>
                    <p className="m-0 text-sm text-texto-secundario leading-relaxed">
                      Revisamos tu volumen de pedidos y definimos la tarifa por
                      viaje adecuada a tu negocio, con demostración en vivo de
                      la plataforma y la aplicación de repartidores.
                    </p>

                    <div className="flex flex-col gap-3 pt-1">
                      <div className="p-4 rounded-[14px] bg-rosa-niebla/65 flex flex-col gap-1">
                        <div className="font-semibold text-sm text-azul-tinta flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="w-2 h-2 rounded-full bg-esmeralda shrink-0"
                          />
                          Sin mensualidad fija
                        </div>
                        <p className="m-0 text-xs text-texto-secundario leading-relaxed pl-4">
                          Ideal para restaurantes, farmacias y comercios con
                          flota propia o motorizados aliados.
                        </p>
                      </div>
                      <div className="p-4 rounded-[14px] bg-rosa-niebla/65 flex flex-col gap-1">
                        <div className="font-semibold text-sm text-azul-tinta flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="w-2 h-2 rounded-full bg-esmeralda shrink-0"
                          />
                          Rastreo en vivo para tu cliente
                        </div>
                        <p className="m-0 text-xs text-texto-secundario leading-relaxed pl-4">
                          Tu cliente recibe un enlace por WhatsApp para ver su
                          pedido en el mapa en tiempo real.
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppLink(
                      "Hola NEXOL, me gustaría agendar una demostración de NEXOL Delivery.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 min-h-[52px] px-6 rounded-[12px] bg-esmeralda-oscura hover:bg-esmeralda-hover text-blanco font-semibold text-[15px] no-underline transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar demostración</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox para capturas de POS */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-azul-profundo/90 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightboxImage}
              alt="Captura NEXOL POS"
              className="relative max-w-[95vw] max-h-[90vh] object-contain rounded-xl border border-blanco/20"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-rosa-niebla text-azul-tinta font-mono text-xs font-bold rounded-full cursor-pointer border-0"
            >
              <Minimize2 className="w-4 h-4 text-azul-tinta" />
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
