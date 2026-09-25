import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Layers,
  FolderOpen,
  Tag,
  Mail,
  Home,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navLinksRef = useRef<(HTMLButtonElement | null)[]>([]);

  const NAV_LINKS = [
    { label: t("nav.services"), href: "#servicios", icon: Layers },
    { label: t("nav.projects"), href: "#proyectos", icon: FolderOpen },
    { label: t("nav.tracking", "Tracking"), href: "#tracking", icon: Radio },
    { label: t("nav.pricing"), href: "#planes", icon: Tag },
    { label: t("nav.contact"), href: "#contacto", icon: Mail },
  ];

  const currentLang = i18n.language.startsWith("es") ? "ES" : "EN";
  const nextLang = i18n.language.startsWith("es") ? "EN" : "ES";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveLink(`#${id}`);
        },
        { threshold: 0.4 },
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    const targetIndex =
      hoverIndex !== null
        ? hoverIndex
        : NAV_LINKS.findIndex((l) => l.href === activeLink);
    const el = navLinksRef.current[targetIndex];
    if (el) {
      const { offsetLeft, offsetWidth } = el;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [hoverIndex, activeLink, i18n.language]);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    setActiveLink(href);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveLink(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveIndicator =
    hoverIndex !== null || NAV_LINKS.some((l) => l.href === activeLink);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
      >
        <div
          className={`
            pointer-events-auto
            flex items-center gap-1.5 sm:gap-2.5
            pl-3.5 sm:pl-4 pr-2 sm:pr-2.5 py-1.5 sm:py-2
            rounded-full
            border transition-all duration-300
            ${
              scrolled
                ? "bg-zinc-950/85 backdrop-blur-2xl border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.65)] scale-[0.98]"
                : "bg-zinc-950/60 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
            }
          `}
        >
          {/* Brand Logo */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2.5 cursor-pointer py-1 pr-1.5 rounded-full group transition-transform duration-200 active:scale-95 bg-transparent border-none"
            aria-label="Ir al inicio"
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a3e635] shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-[#a3e635] transition-colors">
              Nexol
            </span>
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5 hidden md:block" />

          {/* Desktop Nav Links */}
          <div
            className="hidden md:flex items-center gap-0.5 relative"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {hasActiveIndicator && (
              <motion.div
                className="absolute top-0 bottom-0 rounded-full bg-white/10 border border-white/10"
                animate={indicatorStyle}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}

            {NAV_LINKS.map((link, i) => {
              const isActive = activeLink === link.href;
              return (
                <button
                  key={link.href}
                  ref={(el) => {
                    navLinksRef.current[i] = el;
                  }}
                  onClick={() => scrollToSection(link.href)}
                  onMouseEnter={() => setHoverIndex(i)}
                  className={`
                    relative px-3.5 py-1.5 text-xs font-medium tracking-normal rounded-full cursor-pointer
                    transition-colors duration-200 bg-transparent border-none
                    ${
                      isActive
                        ? "text-[#a3e635] font-semibold"
                        : "text-zinc-300 hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="w-px h-4 bg-white/10 mx-0.5 hidden md:block" />

          {/* Language Switcher */}
          <div
            className="hidden md:flex items-center bg-black/40 rounded-full p-0.5 border border-white/10 relative"
            title={`Switch to ${nextLang}`}
          >
            <motion.div
              className="absolute top-0.5 bottom-0.5 rounded-full bg-white/15"
              animate={{
                left: currentLang === "ES" ? "2px" : "50%",
                width: "calc(50% - 2px)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
            {["ES", "EN"].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang.toLowerCase())}
                className={`
                  relative z-10 px-2.5 py-0.5 text-[11px] font-semibold rounded-full cursor-pointer border-none
                  transition-colors duration-200 bg-transparent
                  ${currentLang === lang ? "text-[#a3e635]" : "text-zinc-400 hover:text-zinc-200"}
                `}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => {
              scrollToSection("#contacto");
              import("react-ga4").then((ga) => {
                ga.default.event({
                  category: "Navigation",
                  action: "Clic Iniciar Proyecto",
                  label: "Navbar Desktop",
                });
              });
            }}
            className="
              hidden md:inline-flex items-center gap-1.5
              px-4 py-1.5 rounded-full text-xs font-bold tracking-tight
              cursor-pointer border-none
              bg-[#a3e635] hover:bg-[#bcf947]
              text-black
              shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)]
              transition-all duration-200 active:scale-95
            "
          >
            <span>{t("nav.cta")}</span>
            <ArrowUpRight size={13} className="stroke-[2.5]" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden text-zinc-200 bg-transparent border-none cursor-pointer p-1.5 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="p-4 flex flex-col gap-1.5">
                {[
                  { label: t("nav.home"), href: "#hero", icon: Home },
                  ...NAV_LINKS,
                ].map((link) => {
                  const Icon = link.icon;
                  const isActive = activeLink === link.href;
                  return (
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide w-full text-left
                        border cursor-pointer transition-all duration-150
                        ${
                          isActive
                            ? "bg-white/10 text-[#a3e635] border-white/15"
                            : "bg-transparent text-zinc-400 border-transparent hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        size={16}
                        className={
                          isActive ? "text-[#a3e635]" : "text-zinc-400"
                        }
                      />
                      {link.label}
                    </button>
                  );
                })}

                <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-white/10 bg-white/5 mt-1">
                  <span className="text-xs font-medium text-zinc-400">
                    Idioma / Language
                  </span>
                  <div className="flex items-center bg-black/50 rounded-full p-0.5 border border-white/10 relative">
                    <motion.div
                      className="absolute top-0.5 bottom-0.5 rounded-full bg-white/15"
                      animate={{
                        left: currentLang === "ES" ? "2px" : "50%",
                        width: "calc(50% - 2px)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                    />
                    {["ES", "EN"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => i18n.changeLanguage(lang.toLowerCase())}
                        className={`
                          relative z-10 px-3 py-1 text-[11px] font-semibold rounded-full cursor-pointer border-none
                          transition-colors duration-150 bg-transparent
                          ${currentLang === lang ? "text-[#a3e635]" : "text-zinc-400"}
                        `}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 mt-1">
                  <button
                    onClick={() => {
                      scrollToSection("#contacto");
                      import("react-ga4").then((ga) => {
                        ga.default.event({
                          category: "Navigation",
                          action: "Clic Iniciar Proyecto",
                          label: "Navbar Mobile",
                        });
                      });
                    }}
                    className="
                      w-full py-3 rounded-full text-xs font-bold tracking-tight flex items-center justify-center gap-1.5
                      bg-[#a3e635] hover:bg-[#bcf947] text-black
                      border-none cursor-pointer transition-all duration-150 shadow-[0_0_20px_rgba(163,230,53,0.3)]
                    "
                  >
                    <span>{t("nav.cta")}</span>
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 md:hidden bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
};
