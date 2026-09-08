import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Globe,
  Receipt,
  Truck,
  ArrowRight,
  Printer,
  Maximize2,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
} from "@/shared/hooks/useScrollReveal";

// =========================================================================
// CONFIGURACIÓN DE PRECIOS EDITABLE
// =========================================================================
export const POS_MONTHLY_PRICE = 45; // Precio mensual en USD para el POS Todo Incluido
export const WEB_STARTER_PRICE = 300; // Precio base en USD para Páginas Web
export const WEB_MAINTENANCE_PRICE = 30; // Mantenimiento mensual en USD tras meses incluidos

const WHATSAPP_PHONE = "50587140989";

type PricingCategory = "web" | "pos" | "logistics";

const POS_SHOWCASE_IMAGES = [
  {
    src: "/assets/project/pos/order_POS.png",
    title: "Toma de Órdenes & Facturación",
    desc: "Selección rápida de productos, categorías y cobro directo.",
  },
  {
    src: "/assets/project/pos/caja_POS.png",
    title: "Control de Caja & Turnos",
    desc: "Apertura, cierre de turno, arqueo y registro de movimientos de efectivo.",
  },
  {
    src: "/assets/project/pos/catalogo_POS.png",
    title: "Inventario & Catálogo en Vivo",
    desc: "Stock en tiempo real con precios, costos y alertas de stock bajo.",
  },
];

export const Pricing = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<PricingCategory>("pos");
  const [selectedPosImage, setSelectedPosImage] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { ref, isInView } = useScrollReveal(0.1);

  const CATEGORY_TABS: {
    id: PricingCategory;
    label: string;
    icon: typeof Globe;
  }[] = [
    {
      id: "web",
      label: t("pricing.tabs.web", "Páginas Web"),
      icon: Globe,
    },
    {
      id: "pos",
      label: t("pricing.tabs.pos", "Facturación / POS"),
      icon: Receipt,
    },
    {
      id: "logistics",
      label: t("pricing.tabs.logistics", "Logística y Delivery"),
      icon: Truck,
    },
  ];

  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  const scrollToTracking = () => {
    const el = document.getElementById("tracking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Section id="planes">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* Section Header */}
        <motion.div variants={fadeUpVariants} className="text-center mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#a3e635] mb-2 block">
            {t("pricing.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* 3 Main Category Tabs (No decorative pill badges) */}
        <motion.div
          variants={fadeUpVariants}
          className="flex justify-center mb-10"
        >
          <div
            className="inline-flex flex-wrap justify-center gap-1.5 p-1 bg-[#121212] border border-zinc-800 rounded-[2px]"
            role="tablist"
            aria-label="Planes por Categoría"
          >
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-5 py-2.5 rounded-[2px] font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-[#a3e635] text-black shadow-sm"
                      : "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Category Panels */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ================================================================= */}
            {/* PESTAÑA 1: PÁGINAS WEB                                            */}
            {/* ================================================================= */}
            {activeCategory === "web" && (
              <motion.div
                key="web"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Main Web Plan Card (7 cols) */}
                <div className="lg:col-span-7 bg-[#121212] border border-zinc-800 rounded-[2px] p-8 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#a3e635] font-bold">
                        Presencia Digital
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400">
                        Entrega en 1-3 semanas
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-3 tracking-tight">
                      Tu Sitio Web Profesional
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      {t("pricing.web.desc")}
                    </p>

                    {/* Flat Price Block */}
                    <div className="p-6 rounded-[2px] bg-black border border-zinc-800 mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium">
                          Desde
                        </span>
                        <span className="text-5xl font-black text-white tracking-tight">
                          ${WEB_STARTER_PRICE}
                        </span>
                        <span className="font-mono text-xs text-zinc-500 ml-1">
                          pago único
                        </span>
                      </div>
                      <p className="font-mono text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
                        <span className="text-[#a3e635]">—</span>
                        <span>+ ${WEB_MAINTENANCE_PRICE}/mes tras 2 meses de soporte incluidos</span>
                      </p>
                    </div>

                    {/* Features List (No colored bubble checkmarks) */}
                    <div className="space-y-3 mb-8">
                      <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
                        Alcance del proyecto:
                      </p>
                      {[
                        "Diseño a medida moderno, limpio y 100% adaptable (móvil, tablet, desktop)",
                        "Formulario de contacto estructurado con enlace directo a WhatsApp",
                        "Optimización de velocidad y SEO para posicionamiento en Google",
                        "Entrega rápida garantizada en 1 a 3 semanas",
                        "2 meses de soporte técnico y mantenimiento preventivo incluidos",
                      ].map((feat, fi) => (
                        <div key={fi} className="flex items-start gap-3 text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={getWhatsAppLink("Hola DETDevs, me interesa cotizar un Sitio Web Profesional para mi negocio.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-[2px] bg-[#a3e635] hover:bg-[#b5ff14] text-black font-mono text-xs uppercase tracking-wider font-bold text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Solicitar mi sitio web</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Side Card: Maintenance (5 cols) */}
                <div className="lg:col-span-5 bg-[#121212] border border-zinc-800 rounded-[2px] p-8 flex flex-col justify-between shadow-sm">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-2 font-bold">
                      Garantía & Mantenimiento
                    </h4>
                    <h5 className="text-xl font-bold uppercase text-white mb-3 tracking-tight">
                      Tu sitio siempre disponible
                    </h5>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      No desaparecemos después de entregar. Nuestro soporte se asegura de que tu plataforma funcione de manera ininterrumpida.
                    </p>

                    <div className="space-y-4">
                      {[
                        {
                          title: "Monitoreo de Infraestructura",
                          desc: "Supervisión de servidores, certificados SSL y disponibilidad 24/7.",
                        },
                        {
                          title: "Respaldos en la Nube",
                          desc: "Copias de seguridad semanales para resguardar toda la información.",
                        },
                        {
                          title: "Soporte Técnico Continuo",
                          desc: "Ajustes de contenidos, actualización de catálogos y asistencia vía WhatsApp.",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-[2px] bg-black border border-zinc-800">
                          <div className="font-bold text-sm uppercase text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#a3e635]" />
                            {item.title}
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-800 text-xs text-zinc-500 font-mono text-center">
                    Código limpio y de tu propiedad. Sin letra chica.
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================================================================= */}
            {/* PESTAÑA 2: FACTURACIÓN / POS (UN SOLO PLAN TODO INCLUIDO)          */}
            {/* ================================================================= */}
            {activeCategory === "pos" && (
              <motion.div
                key="pos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#121212] border border-zinc-800 rounded-[2px] p-6 sm:p-8 shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Plan Information (6 cols) */}
                  <div className="lg:col-span-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#a3e635] font-bold">
                          Un Solo Plan · Todo Incluido
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-4xl font-black uppercase text-white mb-3 tracking-tight">
                        Sistema de Facturación / POS
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Sin versiones recortadas ni escalones artificiales. Toda la funcionalidad completa del punto de venta en una única cuota mensual predecible.
                      </p>

                      {/* Flat Price Box (No gradients) */}
                      <div className="p-6 rounded-[2px] bg-black border border-zinc-800 mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                            ${POS_MONTHLY_PRICE}
                          </span>
                          <span className="font-mono text-sm text-zinc-300 font-bold">
                            /mes
                          </span>
                          <span className="font-mono text-xs text-zinc-500 ml-1">
                            por sucursal
                          </span>
                        </div>
                        <p className="font-mono text-xs text-zinc-400 mt-2 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#a3e635]" />
                          <span>Actualizaciones continuas, hosting y soporte técnico incluidos</span>
                        </p>
                      </div>

                      {/* Features Checklist (Clean checks, no bubbles) */}
                      <div className="space-y-3 mb-8">
                        <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
                          Capacidades incluidas:
                        </p>
                        {[
                          "Facturación electrónica rápida y emisión de comprobantes",
                          "Inventario en tiempo real con alertas automáticas de stock bajo",
                          "Control de caja: apertura/cierre de turno, arqueo y entradas/salidas (Cash In / Out)",
                          "Reportes avanzados de ventas, productos de mayor rotación y márgenes",
                          "Gestión multi-usuario con roles de cajero, supervisor y administrador",
                          "Hardware ESC/POS integrado: impresoras térmicas de tickets y cajón de dinero",
                        ].map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm text-zinc-200">
                            <Check className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Solid Primary Button */}
                    <a
                      href={getWhatsAppLink(`Hola DETDevs, quiero una demo del Sistema de Facturación / POS Todo Incluido ($${POS_MONTHLY_PRICE}/mes).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-[2px] bg-[#a3e635] hover:bg-[#b5ff14] text-black font-mono text-xs uppercase tracking-wider font-bold text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comenzar con POS</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Right Column: Social Proof (6 cols) */}
                  <div className="lg:col-span-6 bg-black border border-zinc-800 rounded-[2px] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                        <div>
                          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                            Prueba Social
                          </span>
                          <h4 className="text-base font-bold uppercase text-white tracking-tight">
                            Probado en producción real
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-[2px] bg-zinc-900 border border-zinc-800 text-[10px] text-[#a3e635] font-mono">
                          TrackDeli POS
                        </span>
                      </div>

                      {/* Main Featured Screenshot */}
                      <div className="relative rounded-[2px] overflow-hidden border border-zinc-800 aspect-[16/10] bg-zinc-950 mb-3">
                        <img
                          src={POS_SHOWCASE_IMAGES[selectedPosImage].src}
                          alt={POS_SHOWCASE_IMAGES[selectedPosImage].title}
                          className="w-full h-full object-cover object-top"
                        />
                        <button
                          onClick={() => setLightboxImage(POS_SHOWCASE_IMAGES[selectedPosImage].src)}
                          className="absolute top-2 right-2 px-2.5 py-1 bg-black/80 hover:bg-black text-zinc-300 hover:text-white border border-zinc-700 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer rounded-[2px]"
                        >
                          <Maximize2 className="w-3 h-3 text-[#a3e635]" />
                          <span>Ampliar</span>
                        </button>
                      </div>

                      <div className="text-xs font-bold uppercase text-white mb-0.5">
                        {POS_SHOWCASE_IMAGES[selectedPosImage].title}
                      </div>
                      <div className="text-xs text-zinc-400 mb-4">
                        {POS_SHOWCASE_IMAGES[selectedPosImage].desc}
                      </div>

                      {/* Thumbnail Selector */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800">
                        {POS_SHOWCASE_IMAGES.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPosImage(idx)}
                            className={`rounded-[2px] overflow-hidden border transition-all p-0.5 bg-zinc-950 cursor-pointer ${
                              selectedPosImage === idx
                                ? "border-[#a3e635]"
                                : "border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={item.src}
                              alt={item.title}
                              className="w-full aspect-[16/10] object-cover rounded-[1px]"
                            />
                            <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 mt-1 truncate px-1 text-left">
                              {item.title}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hardware Notice */}
                    <div className="mt-5 p-3 rounded-[2px] bg-zinc-900 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-300">
                      <Printer className="w-4 h-4 text-[#a3e635] shrink-0" />
                      <span>Compatible con impresoras térmicas USB/Red y gavetas de dinero RJ11.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================================================================= */}
            {/* PESTAÑA 3: LOGÍSTICA Y DELIVERY (SIN PRECIOS NI NÚMEROS)          */}
            {/* ================================================================= */}
            {activeCategory === "logistics" && (
              <motion.div
                key="logistics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#121212] border border-zinc-800 rounded-[2px] p-6 sm:p-8 shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Value Proposition (7 cols) */}
                  <div className="lg:col-span-7">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#a3e635] font-bold block mb-2">
                      Modelo Flexible
                    </span>

                    <h3 className="text-2xl sm:text-4xl font-black uppercase text-white mb-4 tracking-tight">
                      Logística y Delivery Inteligente
                    </h3>

                    {/* Flat Highlight Box (Zero fixed cost) */}
                    <div className="p-6 rounded-[2px] bg-black border border-zinc-800 mb-6">
                      <p className="text-base sm:text-lg font-bold text-white leading-snug uppercase tracking-tight">
                        "Modelo de comisión por entrega — sin costo fijo mensual, solo pagás cuando tu negocio despacha."
                      </p>
                      <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
                        Tarifa acordada por pedido entregado según el volumen de tu operación. Si no despachás, no pagás.
                      </p>
                    </div>

                    {/* Key Technical Highlights (Clean checks) */}
                    <div className="space-y-3 mb-4">
                      {[
                        "Despacho automático algorítmico al repartidor más cercano o asignación manual",
                        "Tracking GPS en tiempo real para el cliente final (sin necesidad de descargar apps)",
                        "App móvil nativa para repartidores (Flutter) con telemetría en vivo y ruta optimizada",
                        "Panel web administrativo multi-tenant para monitorear órdenes, tiempos y flota",
                        "Liquidación automática y transparente de comisiones por cada entrega completada",
                      ].map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: CTA (5 cols) */}
                  <div className="lg:col-span-5 bg-black border border-zinc-800 rounded-[2px] p-8 flex flex-col justify-between text-center">
                    <div>
                      <div className="w-12 h-12 rounded-[2px] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#a3e635] mx-auto mb-4">
                        <Calendar className="w-6 h-6" />
                      </div>

                      <h4 className="text-xl font-bold uppercase text-white mb-2 tracking-tight">
                        Agendar una llamada
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                        Revisamos tu volumen de pedidos y definimos la tarifa por viaje adecuada a tu negocio.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={getWhatsAppLink("Hola DETDevs, me interesa agendar una llamada sobre el Sistema de Logística y Delivery (modelo de comisión).")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-[2px] bg-[#a3e635] hover:bg-[#b5ff14] text-black font-mono text-xs uppercase tracking-wider font-bold text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Agendar una llamada</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>

                      <button
                        onClick={scrollToTracking}
                        className="w-full py-2.5 rounded-[2px] bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white font-mono text-[11px] uppercase tracking-wider border border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Ver simulación en vivo del tracking</span>
                        <span className="text-[#a3e635]">↓</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Lightbox for POS Screenshots */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              src={lightboxImage}
              alt="TrackDeli POS Captura"
              className="relative max-w-[95vw] max-h-[92vh] object-contain rounded-[2px] border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-20 px-4 py-2 bg-[#121212] hover:bg-zinc-800 font-mono text-xs uppercase tracking-wider text-white border border-zinc-700 rounded-[2px] cursor-pointer"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
