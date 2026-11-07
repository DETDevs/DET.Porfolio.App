import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { scrollTo } from "@/shared/hooks/useLenis";

const NAV_LINKS = [
  { key: "services", href: "#servicios", num: "01" },
  { key: "projects", href: "#proyectos", num: "02" },
  { key: "pricing", href: "#planes", num: "03" },
  { key: "contact", href: "#contacto", num: "04" },
] as const;

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "es";
  const setLanguage = (lang: "es" | "en") => {
    i18n.changeLanguage(lang);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const isMobileMenuOpenRef = useRef(isMobileMenuOpen);

  // Escuchar si el modal de proyecto está abierto para ocultar el navbar
  useEffect(() => {
    const onModalToggle = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      setIsProjectModalOpen(!!custom.detail?.open);
      if (custom.detail?.open) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("project-modal-toggle", onModalToggle);
    return () =>
      window.removeEventListener("project-modal-toggle", onModalToggle);
  }, []);

  // Bloqueo de scroll al abrir el menú móvil
  useEffect(() => {
    isMobileMenuOpenRef.current = isMobileMenuOpen;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      if (headerRef.current) {
        gsap.to(headerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Tecla Escape para cerrar el menú móvil
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const sections = ["servicios", "proyectos", "planes", "contacto"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(`#${id}`);
            }
          },
          { threshold: 0.25 },
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    const handleScrollActive = () => {
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScrollActive, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollActive);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Scroll behavior: top bar leaves on first scroll and only returns at the very top;
  // past 120px, navbar hides on scroll down and returns on scroll up. Never hides if mobile menu is open.
  useEffect(() => {
    const headerEl = headerRef.current;
    const topBarEl = topBarRef.current;
    if (!headerEl || !topBarEl) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reduce } = context.conditions as {
          motion: boolean;
          reduce: boolean;
        };

        let lastY = window.scrollY;
        let state: "top" | "scrolled-visible" | "hidden" = "top";

        const updateHeader = () => {
          const currentY = window.scrollY;
          const delta = currentY - lastY;

          if (isMobileMenuOpenRef.current) {
            if (state !== "top") {
              state = "top";
              gsap.to(headerEl, {
                y: 0,
                opacity: 1,
                duration: reduce ? 0.2 : 0.4,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
            lastY = currentY;
            return;
          }

          const topBarH = topBarEl.offsetHeight || 33;
          const totalH = headerEl.offsetHeight || 96;

          if (currentY <= 8) {
            if (state !== "top") {
              state = "top";
              if (reduce) {
                gsap.set(headerEl, { y: 0 });
                gsap.to(headerEl, {
                  opacity: 1,
                  duration: 0.25,
                  overwrite: "auto",
                });
              } else {
                gsap.to(headerEl, {
                  y: 0,
                  opacity: 1,
                  duration: 0.45,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              }
            }
          } else if (currentY > 120 && delta > 1.5) {
            // Scrolling down past 120px -> hide navbar upwards
            if (state !== "hidden") {
              state = "hidden";
              if (reduce) {
                gsap.to(headerEl, {
                  opacity: 0,
                  duration: 0.25,
                  overwrite: "auto",
                });
              } else {
                gsap.to(headerEl, {
                  y: -totalH - 4,
                  duration: 0.45,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              }
            }
          } else if (delta < -1.5 || (currentY <= 120 && currentY > 8)) {
            // Scrolling up (or between 8px and 120px) -> show main nav, keep top bar hidden
            if (state !== "scrolled-visible") {
              state = "scrolled-visible";
              if (reduce) {
                gsap.set(headerEl, { y: -topBarH });
                gsap.to(headerEl, {
                  opacity: 1,
                  duration: 0.25,
                  overwrite: "auto",
                });
              } else {
                gsap.to(headerEl, {
                  y: -topBarH,
                  opacity: 1,
                  duration: 0.45,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              }
            }
          }

          lastY = currentY;
        };

        window.addEventListener("scroll", updateHeader, { passive: true });
        return () => {
          window.removeEventListener("scroll", updateHeader);
        };
      },
    );

    return () => mm.revert();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      scrollTo(href, { offset: -96 });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 flex flex-col will-change-transform ${
          isProjectModalOpen ? "!hidden !pointer-events-none" : ""
        }`}
      >
        {/* 1. Barra superior fina de ubicación y estado */}
        <div
          ref={topBarRef}
          role="region"
          aria-label={t("nav.topbar_aria", "Ubicación y estado")}
          className="w-full bg-rosa-niebla border-b border-azul-tinta/[0.18]"
        >
          <div className="w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] py-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-texto-secundario-muted">
            <span>
              {t("nav.top_banner", "Software hecho en Managua, Nicaragua")}
            </span>
            <span className="inline-flex items-center gap-2 text-azul-tinta font-medium">
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full bg-esmeralda shrink-0"
              />
              {t("nav.top_whatsapp", "WhatsApp +505 8714 0989")}
            </span>
          </div>
        </div>

        {/* 2. Navegación principal */}
        <nav
          aria-label={t("nav.main_aria", "Principal")}
          className="w-full bg-rosa-niebla/90 backdrop-blur-md border-b border-azul-tinta/[0.18]"
        >
          <div className="w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] py-3.5 flex items-center justify-between gap-4">
            {/* Logo NEXOL con punto esmeralda */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                scrollTo(0);
              }}
              aria-label={t("nav.logo_aria", "NEXOL, ir al inicio")}
              className="font-bricolage font-extrabold text-[26px] tracking-[-0.04em] text-azul-tinta no-underline inline-flex items-baseline"
            >
              nexol<span className="text-esmeralda">.</span>
            </a>

            {/* Enlaces centrales (Desktop) */}
            <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`text-[15px] font-medium py-2 transition-colors no-underline ${
                        isActive
                          ? "text-esmeralda-oscura font-semibold"
                          : "text-azul-tinta hover:text-esmeralda-oscura"
                      }`}
                    >
                      {t(`nav.${item.key}`)}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Acciones derecha (Desktop): Selector ES/EN + Botón Iniciar proyecto */}
            <div className="hidden md:flex items-center gap-3">
              <div
                role="group"
                aria-label={t("nav.lang_aria", "Idioma")}
                className="inline-flex border-[1.5px] border-azul-tinta rounded-full p-[3px] font-mono text-xs"
              >
                <button
                  type="button"
                  aria-pressed={currentLang === "es"}
                  onClick={() => setLanguage("es")}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    currentLang === "es"
                      ? "bg-azul-tinta text-rosa-niebla"
                      : "bg-transparent text-azul-tinta hover:text-esmeralda-oscura"
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  aria-pressed={currentLang === "en"}
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    currentLang === "en"
                      ? "bg-azul-tinta text-rosa-niebla"
                      : "bg-transparent text-azul-tinta hover:text-esmeralda-oscura"
                  }`}
                >
                  EN
                </button>
              </div>

              <a
                href="#contacto"
                onClick={(e) => handleNavClick(e, "#contacto")}
                className="inline-flex items-center gap-2 bg-esmeralda-oscura hover:bg-esmeralda-hover text-blanco px-[18px] py-[11px] rounded-full font-semibold text-sm no-underline transition-colors"
              >
                <span>{t("nav.cta", "Iniciar proyecto")}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            {/* Controles Mobile: Selector ES/EN + Botón Redondo Menú */}
            <div className="flex items-center gap-2.5 md:hidden">
              <div
                role="group"
                aria-label={t("nav.lang_aria", "Idioma")}
                className="inline-flex border-[1.5px] border-azul-tinta rounded-full p-[2px] font-mono text-xs"
              >
                <button
                  type="button"
                  aria-pressed={currentLang === "es"}
                  onClick={() => setLanguage("es")}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                    currentLang === "es"
                      ? "bg-azul-tinta text-rosa-niebla"
                      : "bg-transparent text-azul-tinta"
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  aria-pressed={currentLang === "en"}
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                    currentLang === "en"
                      ? "bg-azul-tinta text-rosa-niebla"
                      : "bg-transparent text-azul-tinta"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-expanded={isMobileMenuOpen}
                aria-label={t("nav.open_menu", "Abrir menú")}
                className="w-10 h-10 rounded-full border border-azul-tinta/20 bg-blanco/60 hover:bg-azul-tinta/5 active:bg-azul-tinta/10 flex items-center justify-center text-azul-tinta transition-all cursor-pointer"
              >
                <Menu size={20} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ========================================================= */}
      {/* MENÚ MÓVIL A PANTALLA COMPLETA (DISEÑO MODERNO Y ELEGANTE) */}
      {/* ========================================================= */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                key="mobile-nav-portal"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[9990] bg-rosa-niebla text-azul-tinta flex flex-col justify-between overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-label={t("nav.main_aria", "Menú principal")}
              >
                {/* 1. Header dentro del menú móvil */}
                <div className="w-full border-b border-azul-tinta/[0.14] bg-rosa-niebla/95 backdrop-blur-md sticky top-0 z-10">
                  <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        scrollTo(0);
                      }}
                      aria-label={t("nav.logo_aria", "NEXOL, ir al inicio")}
                      className="font-bricolage font-extrabold text-[26px] tracking-[-0.04em] text-azul-tinta no-underline inline-flex items-baseline"
                    >
                      nexol<span className="text-esmeralda">.</span>
                    </a>

                    {/* Selector de idioma y botón cerrar redondo */}
                    <div className="flex items-center gap-3">
                      <div
                        role="group"
                        aria-label={t("nav.lang_aria", "Idioma")}
                        className="inline-flex border-[1.5px] border-azul-tinta rounded-full p-[2px] font-mono text-xs"
                      >
                        <button
                          type="button"
                          aria-pressed={currentLang === "es"}
                          onClick={() => setLanguage("es")}
                          className={`px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                            currentLang === "es"
                              ? "bg-azul-tinta text-rosa-niebla"
                              : "bg-transparent text-azul-tinta"
                          }`}
                        >
                          ES
                        </button>
                        <button
                          type="button"
                          aria-pressed={currentLang === "en"}
                          onClick={() => setLanguage("en")}
                          className={`px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                            currentLang === "en"
                              ? "bg-azul-tinta text-rosa-niebla"
                              : "bg-transparent text-azul-tinta"
                          }`}
                        >
                          EN
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label={t("nav.close_menu", "Cerrar menú")}
                        className="w-10 h-10 rounded-full border border-azul-tinta/20 bg-blanco/70 hover:bg-azul-tinta/10 active:scale-95 flex items-center justify-center text-azul-tinta transition-all cursor-pointer"
                      >
                        <X size={20} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Cuerpo: Enlaces grandes, editoriales y elegantes */}
                <div className="w-full max-w-[640px] mx-auto px-6 py-8 sm:px-10 flex-1 flex flex-col justify-center">
                  <p className="m-0 mb-4 font-mono text-xs uppercase tracking-[0.14em] text-esmeralda-oscura font-medium">
                    // Navegación
                  </p>

                  <ul className="flex flex-col list-none m-0 p-0 border-t border-azul-tinta/[0.14]">
                    {NAV_LINKS.map((item, idx) => {
                      const isActive = activeSection === item.href;
                      return (
                        <motion.li
                          key={item.key}
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.04 + idx * 0.04,
                            duration: 0.25,
                            ease: "easeOut",
                          }}
                          className="border-b border-azul-tinta/[0.14]"
                        >
                          <a
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className={`group py-4 sm:py-5 flex items-center justify-between no-underline transition-all ${
                              isActive
                                ? "text-esmeralda-oscura"
                                : "text-azul-tinta hover:text-esmeralda-oscura"
                            }`}
                          >
                            <div className="flex items-baseline gap-3.5">
                              <span className="font-mono text-xs text-texto-secundario-muted group-hover:text-esmeralda-oscura transition-colors">
                                {item.num}
                              </span>
                              <span className="font-bricolage text-[clamp(28px,7.5vw,40px)] font-extrabold tracking-[-0.035em] leading-tight group-hover:translate-x-1.5 transition-transform">
                                {t(`nav.${item.key}`)}
                              </span>
                            </div>

                            <span
                              aria-hidden="true"
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                isActive
                                  ? "bg-esmeralda-oscura text-blanco"
                                  : "bg-azul-tinta/[0.05] text-azul-tinta group-hover:bg-esmeralda-oscura group-hover:text-blanco group-hover:scale-105"
                              }`}
                            >
                              <ArrowUpRight size={18} strokeWidth={2.2} />
                            </span>
                          </a>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>

                {/* 3. Pie del menú móvil: CTA principal y tarjeta de WhatsApp */}
                <div className="w-full max-w-[640px] mx-auto px-6 pb-8 sm:px-10 flex flex-col gap-3.5">
                  <a
                    href="#contacto"
                    onClick={(e) => handleNavClick(e, "#contacto")}
                    className="w-full inline-flex items-center justify-center gap-2 bg-esmeralda-oscura active:bg-esmeralda-hover hover:bg-esmeralda-hover text-blanco min-h-[56px] px-6 rounded-[14px] font-semibold text-[17px] shadow-sm transition-all active:scale-[0.99] no-underline"
                  >
                    <span>{t("nav.cta", "Iniciar proyecto")}</span>
                    <span aria-hidden="true">↗</span>
                  </a>

                  <div className="p-3.5 rounded-[12px] bg-blanco/65 border border-azul-tinta/10 flex items-center justify-between gap-2 text-xs font-mono text-texto-secundario-muted">
                    <a
                      href="https://wa.me/50587140989"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-azul-tinta hover:text-esmeralda-oscura font-medium no-underline"
                    >
                      <span className="w-2 h-2 rounded-full bg-esmeralda animate-pulse" />
                      <span>WhatsApp +505 8714 0989</span>
                    </a>
                    <span>Managua, NI</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
