import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SlideData {
  id: string;
  tag: string;
  title: string;
  desc: string;
  image: string;
  link: string;
}

const BASE_SLIDES: SlideData[] = [
  {
    id: "01",
    tag: "SaaS & Logística",
    title: "TrackDeli Web Platform",
    desc: "Despacho inteligente en tiempo real, mapas interactivos y telemetría continua de pedidos.",
    image: "/assets/project/webtrack/dash_webtrack.png",
    link: "#proyectos",
  },
  {
    id: "02",
    tag: "Punto de Venta",
    title: "TrackDeli POS Desktop",
    desc: "Facturación ultrarrápida, apertura/cierre de caja y soporte para impresoras térmicas.",
    image: "/assets/project/pos/caja_POS.png",
    link: "#proyectos",
  },
  {
    id: "03",
    tag: "App Móvil en Vivo",
    title: "TrackDeli Rider App",
    desc: "Aplicación móvil para repartidores con telemetría GPS continua y sincronización instantánea.",
    image: "/assets/project/appdeli/rutaentrega_app.jpg",
    link: "#proyectos",
  },
  {
    id: "04",
    tag: "Gestión Comercial",
    title: "Dulces Momentos POS",
    desc: "Control total de stock, alertas automáticas de reabastecimiento y reportes de rentabilidad.",
    image: "/assets/project/DulcesMomentos/project.png",
    link: "#proyectos",
  },
];

export const Hero = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

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

  // Auto-advance slides every 6 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

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
      x: dir > 0 ? 25 : -25,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 320, damping: 28 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -25 : 25,
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    }),
  };

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <section
      id="hero"
      aria-label="Hero Nexol"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden bg-[#050505] selection:bg-[#a3e635] selection:text-black"
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(163,230,53,0.06),transparent_55%)]" />
      </div>

      {/* Top spacing spacer */}
      <div className="relative z-10 w-full" />

      {/* Main Content Grid (Left: Atmospheric Workstation open view | Right: Typography & Floating Cards) */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end my-auto py-8">
        {/* Left Column (Spacious for 3D visual anchor) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-end pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 max-w-sm"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
              <span>Nexol Architecture Engine</span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              Ingeniería de software robusta, interfaces fluidas y arquitecturas
              en la nube diseñadas para perdurar.
            </p>
          </motion.div>
        </div>

        {/* Right Column (Hero Headline, Progress Tracker & Floating Card Carousel) */}
        <div className="lg:col-span-7 flex flex-col items-start lg:pl-4">
          {/* Eyebrow Badge */}
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-[#a3e635] font-mono text-xs uppercase tracking-widest rounded-full mb-6"
          > */}
          {/* <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" /> */}
          {/* <span>{t("hero.badge")}</span> */}
          {/* <   /motion.div> */}

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white mb-8 leading-[1.08] tracking-tight"
          >
            {t("hero.title_1")}{" "}
            <span className="text-[#a3e635] block sm:inline">
              {t("hero.title_2")}
            </span>
          </motion.h1>

          {/* Progress Tracker: 01 ─────── 04 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            <span className="text-zinc-500 tracking-wider">
              {String(total).padStart(2, "0")}
            </span>
          </motion.div>

          {/* Carousel Cards Container (Active Card + Peek of Next Slide) */}
          <div className="w-full max-w-xl flex items-center gap-4 relative">
            {/* Active Floating Card */}
            <div className="flex-1 relative overflow-hidden rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-5"
                >
                  {/* Thumbnail Image */}
                  <div className="w-full sm:w-44 h-36 sm:h-32 shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-black/60 relative">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#a3e635] block mb-1">
                        {currentSlide.tag}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                        {currentSlide.title}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mt-1 mb-3">
                        {currentSlide.desc}
                      </p>
                    </div>

                    <div>
                      <a
                        href={currentSlide.link}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold tracking-tight transition-all duration-200 hover:shadow-md cursor-pointer no-underline"
                      >
                        <span>{t("hero.cta_card", "Ver proyecto")}</span>
                        <ArrowUpRight size={13} />
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
              className="hidden md:flex w-24 h-32 shrink-0 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 overflow-hidden cursor-pointer opacity-50 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 relative p-2 flex-col justify-between"
            >
              <div className="w-full h-16 rounded-xl overflow-hidden bg-black/40 border border-white/5">
                <img
                  src={nextSlide.image}
                  alt={nextSlide.title}
                  className="w-full h-full object-cover object-top brightness-75"
                />
              </div>
              <div className="text-[10px] font-mono text-zinc-400 truncate">
                {nextSlide.id} / 0{total}
              </div>
            </div>
          </div>

          {/* Navigation Controls: Circular Buttons ← and → */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              aria-label="Slide anterior"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente slide"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white hover:bg-zinc-200 text-black border border-white/20 transition-all duration-200 cursor-pointer active:scale-95 shadow-lg font-bold"
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
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
                    idx === currentIndex
                      ? "w-6 bg-[#a3e635]"
                      : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer hint with scroll arrow */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono text-zinc-500 pt-4 border-t border-white/5">
        <div className="hidden sm:flex items-center gap-2">
          <span>Nexol © {new Date().getFullYear()}</span>
          <span className="text-zinc-700">/</span>
          <span>Desarrollo de Software a Medida</span>
        </div>

        <a
          href="#servicios"
          className="mx-auto sm:mx-0 flex items-center gap-2 text-zinc-500 hover:text-[#a3e635] transition-colors duration-200 no-underline"
        >
          <span>Scroll para explorar</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </a>
      </div>
    </section>
  );
};
