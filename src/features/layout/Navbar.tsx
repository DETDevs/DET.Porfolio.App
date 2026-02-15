import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../../shared/ui/Button";

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Planes", href: "#planes" },
  { label: "Contacto", href: "#contacto" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection("#hero");
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b py-3 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-white/5"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <a
          href="#"
          onClick={scrollToTop}
          className="font-bold text-xl tracking-tighter text-white flex items-center gap-2 no-underline cursor-pointer"
        >
          <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />
          DETDevs
        </a>

        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-violet-400 transition-colors no-underline text-slate-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#contacto"
            onClick={(e) => handleNavClick(e, "#contacto")}
            className="no-underline"
          >
            <Button variant="outline" className="!py-2 !px-4 text-xs">
              Iniciar Proyecto
            </Button>
          </a>
        </div>

        <button
          className="md:hidden text-slate-200 bg-transparent border-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3 text-center">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-slate-300 py-2.5 hover:bg-white/5 rounded-lg no-underline text-sm block"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={(e) => handleNavClick(e, "#contacto")}
                className="no-underline"
              >
                <Button variant="primary" className="w-full mt-2">
                  Iniciar Proyecto
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
