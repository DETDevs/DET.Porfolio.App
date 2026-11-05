import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { scrollTo } from "@/shared/hooks/useLenis";

const NAV_LINKS = [
  { key: "services", href: "#servicios" },
  { key: "projects", href: "#proyectos" },
  { key: "pricing", href: "#planes" },
  { key: "contact", href: "#contacto" },
] as const;

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "es";
  const setLanguage = (lang: "es" | "en") => {
    i18n.changeLanguage(lang);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const headerRef = useRef<HTMLElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const isMobileMenuOpenRef = useRef(isMobileMenuOpen);

  useEffect(() => {
    isMobileMenuOpenRef.current = isMobileMenuOpen;
    if (isMobileMenuOpen && headerRef.current) {
      gsap.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
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
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col will-change-transform"
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

          {/* Controles Mobile */}
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
                className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
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
                className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={
                isMobileMenuOpen
                  ? t("nav.close_menu", "Cerrar menú")
                  : t("nav.open_menu", "Abrir menú")
              }
              className="p-2 rounded-lg text-azul-tinta hover:bg-azul-tinta/10 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú desplegable Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-rosa-niebla border-t border-azul-tinta/[0.18] px-4 py-5 flex flex-col gap-3 shadow-lg">
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl text-base font-semibold no-underline transition-colors ${
                        isActive
                          ? "bg-azul-tinta text-rosa-niebla"
                          : "text-azul-tinta hover:bg-azul-tinta/10"
                      }`}
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <span
                        aria-hidden="true"
                        className={
                          isActive
                            ? "text-esmeralda-clara"
                            : "text-texto-atenuado"
                        }
                      >
                        →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <a
              href="#contacto"
              onClick={(e) => handleNavClick(e, "#contacto")}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-esmeralda-oscura hover:bg-esmeralda-hover text-blanco px-5 py-3.5 rounded-full font-semibold text-sm no-underline transition-colors"
            >
              <span>{t("nav.cta", "Iniciar proyecto")}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};
