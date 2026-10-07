import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Receipt,
  Wallet,
  CalendarCheck,
  Truck,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { POS_PRICE } from "@/config/constants";

interface SlideData {
  id: string;
  tag: string;
  title: string;
  price: string;
  desc: string;
  image: string;
  link: string;
  category?: "web" | "pos" | "citas" | "cartera" | "logistics";
}

const BASE_SLIDES: SlideData[] = [
  {
    id: "01",
    tag: "Punto de Venta",
    title: "Punto de Venta (POS)",
    price: `$${POS_PRICE}/mes por sucursal`,
    desc: "Cobro rápido con pagos mixtos y dólares, control de caja por turno y cajero, inventario y reportes de ventas.",
    image: "/assets/project/pos/caja_POS.png",
    link: "#planes",
    category: "pos",
  },
  {
    id: "02",
    tag: "Cartera de Cobro",
    title: "Cartera de Cobro",
    price: "$25/mes por negocio",
    desc: "Cargá consumos a cuenta de empleados con carnet de código de barras y generá el reporte de deducción para planilla.",
    image: "/assets/project/pos/historial_POS.png",
    link: "#planes",
    category: "cartera",
  },
  {
    id: "03",
    tag: "Citas en línea",
    title: "Agenda de Citas",
    price: "$30/mes",
    desc: "Reservas en línea para tus clientes, agenda por profesional y confirmación automática.",
    image: "/assets/project/bookingwebsite/project.png",
    link: "#planes",
    category: "citas",
  },
  {
    id: "04",
    tag: "Delivery",
    title: "Delivery",
    price: "Comisión por entrega",
    desc: "Despacho en tiempo real con mapa, repartidores y seguimiento de pedidos.",
    image: "/assets/project/webtrack/dash_webtrack.png",
    link: "#planes",
    category: "logistics",
  },
  {
    id: "05",
    tag: "Páginas web",
    title: "Páginas web a la medida",
    price: "Desde $300",
    desc: "Sitio profesional para tu negocio, con hosting incluido y soporte mensual.",
    image: "/assets/project/DulcesMomentos/project.png",
    link: "#planes",
    category: "web",
  },
];

export const Hero = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const renderFallbackIcon = (category?: string, className = "w-10 h-10") => {
    switch (category) {
      case "pos":
        return <Receipt className={className} />;
      case "cartera":
        return <Wallet className={className} />;
      case "citas":
        return <CalendarCheck className={className} />;
      case "logistics":
        return <Truck className={className} />;
      case "web":
      default:
        return <Globe className={className} />;
    }
  };

  // Merge localized data with asset paths
  const slides = useMemo(() => {
    const localized = t("hero.slides", { returnObjects: true }) as
      | Partial<SlideData>[]
      | undefined;
    if (Array.isArray(localized) && localized.length > 0) {
      return BASE_SLIDES.map((base, idx) => ({
        ...base,
        ...(localized[idx] || {}),
        image: base.image,
        link: base.link,
        category: base.category,
      }));
    }
    return BASE_SLIDES;
  }, [t]);

  const total = slides.length;
  const currentSlide = slides[currentIndex] || BASE_SLIDES[0];
  const nextIndex = (currentIndex + 1) % total;
  const nextSlide = slides[nextIndex] || BASE_SLIDES[1];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handlePlanClick = (category?: string, e?: React.MouseEvent) => {
    if (category) {
      window.dispatchEvent(
        new CustomEvent("select-pricing-tab", { detail: category })
      );
    }
    const targetId = category ? `planes-${category}` : "planes";
    const el = document.getElementById(targetId) || document.getElementById("planes");
    if (el) {
      if (e) e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#planes-${category || "pos"}`);
    }
  };

  // Auto-advance slides every 6 seconds when not hovered and reduced motion is off
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 25 : -25,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring" as const, stiffness: 320, damping: 28 },
        opacity: { duration: shouldReduceMotion ? 0.05 : 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -25 : 25,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.15,
      },
    }),
  };

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <section
      id="hero"
      aria-label="Hero Nexol"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden bg-[#050505] selection:bg-[#8FD14F] selection:text-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background 3D Cinematic Asset */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <img
          src="/assets/hero-bg.jpg"
          alt="Nexol Studio Architectural Background"
          className="w-full h-full object-cover object-[30%_center] md:object-center brightness-95 contrast-[1.05]"
          loading="eager"
        />
        {/* Cinematic Vignette Overlays for contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/60 to-black/90 lg:to-[#050505]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(143,209,79,0.06),transparent_55%)]" />
      </div>

      {/* Top spacing spacer */}
      <div className="relative z-10 w-full" />

      {/* Main Content Grid (Left: Atmospheric Workstation open view | Right: Typography & Floating Cards) */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end my-auto py-8">
        {/* Left Column (Spacious for 3D visual anchor) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-end pb-4">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="space-y-4 max-w-sm"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[11px]">
              <span className={`w-2 h-2 rounded-full bg-[#8FD14F] ${shouldReduceMotion ? "" : "animate-pulse"}`} />
              <span>{t("hero.architecture_engine", "Nexol Architecture Engine")}</span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              {t("hero.architecture_tagline", "Ingeniería de software robusta, interfaces fluidas y arquitecturas en la nube diseñadas para perdurar.")}
            </p>
          </motion.div>
        </div>

        {/* Right Column (Hero Headline, Progress Tracker & Floating Card Carousel) */}
        <div className="lg:col-span-7 flex flex-col items-start lg:pl-4">
          {/* Main Headline */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white mb-8 leading-[1.08] tracking-tight"
          >
            {t("hero.title_1")}{" "}
            <span className="text-[#8FD14F] block sm:inline">
              {t("hero.title_2")}
            </span>
          </motion.h1>

          {/* Progress Tracker: 01 ─────── 05 */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="w-full max-w-xl flex items-center gap-4 mb-6 text-xs font-mono text-zinc-400"
          >
            <span className="font-bold text-white tracking-wider">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>

            {/* Track Line with dynamic progress bar */}
            <div className="relative flex-1 h-[2px] bg-zinc-800/80 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-white"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            <span className="text-zinc-400 tracking-wider">
              {String(total).padStart(2, "0")}
            </span>
          </motion.div>

          {/* Carousel Cards Container (Active Card + Peek of Next Slide) */}
          <div className="w-full max-w-xl flex items-center gap-4 relative">
            {/* Active Floating Card */}
            <div className="flex-1 relative overflow-hidden rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group sm:h-[196px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-5"
                >
                  {/* Thumbnail Image */}
                  <div className="w-full sm:w-36 h-36 sm:h-auto shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-black/60 relative">
                    {imageErrors[currentSlide.id] ? (
                      <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-zinc-950 text-[#8FD14F] p-3 text-center">
                        {renderFallbackIcon(currentSlide.category, "w-10 h-10 mb-2 opacity-90")}
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                          {currentSlide.tag}
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={currentSlide.image}
                          alt={currentSlide.title}
                          onError={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [currentSlide.id]: true,
                            }))
                          }
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 flex flex-col justify-between w-full min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#8FD14F] font-semibold truncate">
                          {currentSlide.tag}
                        </span>
                        {currentSlide.price && (
                          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#8FD14F] text-black font-mono text-[10px] font-bold tracking-tight shadow-sm">
                            {currentSlide.price}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                        {currentSlide.title}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-1 mb-2">
                        {currentSlide.desc}
                      </p>
                    </div>

                    <div className="flex items-center flex-wrap gap-3 pt-1">
                      <a
                        href={currentSlide.link}
                        onClick={(e) => handlePlanClick(currentSlide.category, e)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold tracking-tight transition-all duration-200 hover:shadow-md cursor-pointer no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                      >
                        <span>{t("hero.cta_card", "Ver plan")}</span>
                        <ArrowUpRight size={13} />
                      </a>
                      <a
                        href={`https://wa.me/50587140989?text=${encodeURIComponent(
                          `Hola, me interesa ${currentSlide.title}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-[#8FD14F] transition-colors duration-200 no-underline font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                      >
                        <span>{t("hero.cta_whatsapp", "Cotizar por WhatsApp")}</span>
                        <ArrowUpRight size={12} className="opacity-70" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Card Peek (Desktop preview) */}
            <div
              onClick={handleNext}
              title={`Siguiente: ${nextSlide.title}`}
              className="hidden md:flex w-24 sm:h-[196px] shrink-0 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 overflow-hidden cursor-pointer opacity-50 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 relative p-2 flex-col justify-between"
            >
              <div className="w-full h-20 rounded-xl overflow-hidden bg-black/40 border border-white/5">
                {imageErrors[nextSlide.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-[#8FD14F]">
                    {renderFallbackIcon(nextSlide.category, "w-6 h-6 opacity-80")}
                  </div>
                ) : (
                  <img
                    src={nextSlide.image}
                    alt={nextSlide.title}
                    onError={() =>
                      setImageErrors((prev) => ({
                        ...prev,
                        [nextSlide.id]: true,
                      }))
                    }
                    className="w-full h-full object-cover object-top brightness-75"
                  />
                )}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 truncate">
                {nextSlide.id} / {String(total).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Navigation Controls: Circular Buttons ← and → */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              aria-label="Slide anterior"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente slide"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white hover:bg-zinc-200 text-black border border-white/20 transition-all duration-200 cursor-pointer active:scale-95 shadow-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              <ArrowRight size={16} />
            </button>

            {/* Slide dots indicator */}
            <div className="flex items-center gap-1.5 ml-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Ir al slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer border-none p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] ${
                    idx === currentIndex
                      ? "w-6 bg-[#8FD14F]"
                      : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer hint with scroll arrow */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono text-zinc-400 pt-4 border-t border-white/5">
        <div className="hidden sm:flex items-center gap-2">
          <span>Nexol © {new Date().getFullYear()}</span>
          <span className="text-zinc-600">/</span>
          <span>{t("hero.footer_tagline", "Desarrollo de Software a Medida")}</span>
        </div>

        <a
          href="#servicios"
          className="mx-auto sm:mx-0 flex items-center gap-2 text-zinc-400 hover:text-[#8FD14F] transition-colors duration-200 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F]"
        >
          <span>{t("hero.scroll_hint", "Scroll para explorar")}</span>
          <motion.span
            animate={shouldReduceMotion ? { y: 0 } : { y: [0, 4, 0] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </a>
      </div>
    </section>
  );
};
