import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Layers, FolderOpen, Tag, Mail, Home, Radio } from "lucide-react";
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
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div
          className={`
            pointer-events-auto
            flex items-center gap-2
            px-3 py-2
            rounded-[2px]
            border
            transition-all duration-300
            ${
              scrolled
                ? "bg-[#0c0c0c]/90 backdrop-blur-md border-zinc-800 shadow-sm"
                : "bg-[#0c0c0c]/60 backdrop-blur-sm border-zinc-800/80 shadow-none"
            }
          `}
        >
          <button
            onClick={scrollToTop}
            className="font-bold text-sm tracking-tight text-white flex items-center gap-2 cursor-pointer px-2.5 py-1 rounded-[2px] hover:bg-zinc-800/50 transition-colors mr-1"
            aria-label="Ir al inicio"
          >
            <div className="w-2 h-2 rounded-full bg-[#a3e635]" />
            <span className="text-sm font-semibold tracking-tight">DETDevs</span>
          </button>

          <div className="w-px h-4 bg-zinc-800 mx-1" />

          <div
            className="hidden md:flex items-center relative"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {hasActiveIndicator && (
              <motion.div
                className="absolute top-0 bottom-0 rounded-[2px] bg-zinc-800/80 border border-zinc-700/50"
                animate={indicatorStyle}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
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
                    relative px-3.5 py-1.5 text-xs font-mono tracking-wide rounded-[2px] cursor-pointer
                    transition-colors duration-200 bg-transparent border-none
                    ${isActive ? "text-[#a3e635] font-semibold" : "text-zinc-400 hover:text-zinc-200"}
                  `}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="w-px h-4 bg-zinc-800 mx-1 hidden md:block" />

          <div
            className="hidden md:flex items-center bg-[#121212] rounded-[2px] p-0.5 border border-zinc-800 relative"
            title={`Switch to ${nextLang}`}
          >
            <motion.div
              className="absolute top-0.5 bottom-0.5 rounded-[2px] bg-zinc-800"
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
                  relative z-10 px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-[2px] cursor-pointer border-none
                  transition-colors duration-200 bg-transparent
                  ${currentLang === lang ? "text-[#a3e635]" : "text-zinc-500 hover:text-zinc-300"}
                `}
              >
                {lang}
              </button>
            ))}
          </div>

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
              hidden md:flex items-center gap-1.5
              px-3.5 py-1.5 rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider
              cursor-pointer border-none
              bg-[#a3e635] hover:bg-[#bef264]
              text-black
              transition-colors duration-150
            "
          >
            {t("nav.cta")}
          </button>

          <button
            className="md:hidden text-zinc-300 bg-transparent border-none cursor-pointer p-1.5 rounded-[2px] hover:bg-zinc-800/60 transition-colors"
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
                >
                  <X size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-[#0c0c0c]/98 backdrop-blur-xl border border-zinc-800 rounded-[2px] overflow-hidden shadow-2xl">
              <div className="p-3 flex flex-col gap-1">
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
                        flex items-center gap-3 px-4 py-3 rounded-[2px] text-xs font-mono uppercase tracking-wider w-full text-left
                        border cursor-pointer transition-all duration-150
                        ${
                          isActive
                            ? "bg-zinc-900 text-[#a3e635] border-zinc-700"
                            : "bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        size={16}
                        className={
                          isActive ? "text-[#a3e635]" : "text-zinc-500"
                        }
                      />
                      {link.label}
                    </button>
                  );
                })}

                <div className="flex items-center justify-between px-4 py-3 rounded-[2px] border border-zinc-800 bg-[#121212] mt-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Idioma / Language
                  </span>
                  <div className="flex items-center bg-zinc-900 rounded-[2px] p-0.5 border border-zinc-800 relative">
                    <motion.div
                      className="absolute top-0.5 bottom-0.5 rounded-[2px] bg-zinc-800"
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
                          relative z-10 px-3 py-1 text-[11px] font-mono font-bold rounded-[2px] cursor-pointer border-none
                          transition-colors duration-150 bg-transparent
                          ${currentLang === lang ? "text-[#a3e635]" : "text-zinc-500"}
                        `}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 mt-1">
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
                      w-full py-3 rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider
                      bg-[#a3e635] hover:bg-[#bef264] text-black
                      border-none cursor-pointer transition-colors duration-150
                    "
                  >
                    {t("nav.cta")}
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
            className="fixed inset-0 z-30 md:hidden bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
};
