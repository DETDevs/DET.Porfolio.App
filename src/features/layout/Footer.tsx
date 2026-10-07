import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowUpRight, Globe, Phone } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = hash;
      }
    }
  };

  const ctaWhatsAppUrl = `https://wa.me/50587140989?text=${encodeURIComponent(
    t("footer.cta_whatsapp_msg"),
  )}`;

  const currentYear = new Date().getFullYear();

  const fadeUp = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <footer className="border-t border-zinc-800 bg-[#050505] text-zinc-300 relative overflow-hidden">
      {/* 1. Franja de Cierre (CTA) */}
      <motion.div
        {...fadeUp}
        className="max-w-7xl mx-auto px-6 pt-16 pb-16 sm:pt-20 sm:pb-20 border-b border-zinc-800/80"
      >
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 bg-[#a3e635]/5 blur-3xl pointer-events-none rounded-full" />

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white tracking-tight leading-tight">
            {t("footer.cta_title")}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            {t("footer.cta_subtitle")}
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={ctaWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                import("react-ga4").then((ga) => {
                  ga.default.event({
                    category: "Leads",
                    action: "Clic WhatsApp CTA Footer",
                    label: "Footer Closing Strip",
                  });
                });
              }}
              className="
                inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                bg-[#a3e635] hover:bg-[#bcf947] text-black font-bold text-sm
                shadow-[0_0_25px_rgba(163,230,53,0.3)] hover:shadow-[0_0_35px_rgba(163,230,53,0.5)]
                transition-all duration-200 active:scale-95 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a3e635] focus-visible:ring-offset-2 focus-visible:ring-offset-black
              "
            >
              <MessageCircle className="w-4 h-4 fill-current stroke-none" />
              <span>{t("footer.cta_button")}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* 2. Footer Principal en 4 Columnas */}
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Columna 1: Marca */}
          <div className="flex flex-col">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#a3e635] rounded-[2px] w-fit"
              aria-label="NEXOL - Inicio"
            >
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a3e635] shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
              </span>
              <span className="font-bold text-xl uppercase text-white tracking-tight group-hover:text-[#a3e635] transition-colors">
                Nexol
              </span>
            </Link>

            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-xs">
              {t("footer.brand_tagline")}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-sm text-zinc-300">
              <a
                href="https://wa.me/50587140989"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#a3e635] transition-colors focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none w-fit"
              >
                <Phone className="w-3.5 h-3.5 text-[#a3e635]/80" />
                <span>+505 8714 0989</span>
              </a>

              <a
                href="https://detdevs.com"
                className="inline-flex items-center gap-2 hover:text-[#a3e635] transition-colors focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none w-fit"
              >
                <Globe className="w-3.5 h-3.5 text-[#a3e635]/80" />
                <span>detdevs.com</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Productos */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#a3e635]/80 font-bold mb-4 block">
              {t("footer.col_products")}
            </span>
            <nav aria-label={t("footer.col_products")}>
              <ul className="flex flex-col space-y-3 text-sm">
                <li>
                  <a
                    href="/#planes-pos"
                    onClick={(e) => handleAnchorClick(e, "#planes-pos")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.product_pos")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planes-cartera"
                    onClick={(e) => handleAnchorClick(e, "#planes-cartera")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.product_cartera")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planes-citas"
                    onClick={(e) => handleAnchorClick(e, "#planes-citas")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.product_citas")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planes-delivery"
                    onClick={(e) => handleAnchorClick(e, "#planes-delivery")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.product_delivery")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Columna 3: Empresa */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#a3e635]/80 font-bold mb-4 block">
              {t("footer.col_company")}
            </span>
            <nav aria-label={t("footer.col_company")}>
              <ul className="flex flex-col space-y-3 text-sm">
                <li>
                  <a
                    href="/#servicios"
                    onClick={(e) => handleAnchorClick(e, "#servicios")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.company_services")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#proyectos"
                    onClick={(e) => handleAnchorClick(e, "#proyectos")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.company_projects")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planes"
                    onClick={(e) => handleAnchorClick(e, "#planes")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.company_plans")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#contacto"
                    onClick={(e) => handleAnchorClick(e, "#contacto")}
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.company_contact")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#a3e635]/80 font-bold mb-4 block">
              {t("footer.col_legal")}
            </span>
            <nav aria-label={t("footer.col_legal")}>
              <ul className="flex flex-col space-y-3 text-sm">
                <li>
                  <Link
                    to="/terminos"
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.terms")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacidad"
                    className="text-zinc-300 hover:text-[#a3e635] focus-visible:text-[#a3e635] focus-visible:underline focus-visible:outline-none transition-colors"
                  >
                    {t("footer.privacy")}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* 3. Barra Inferior con protección de espacio contra el botón flotante */}
      <div className="border-t border-zinc-900 bg-[#040404]">
        <div className="max-w-7xl mx-auto px-6 py-6 pb-24 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <div>
            © {currentYear} NEXOL. All rights reserved.
          </div>
          <div className="text-zinc-400">
            {t("footer.crafted")}
          </div>
        </div>
      </div>
    </footer>
  );
};
