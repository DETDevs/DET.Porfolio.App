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
    category?: string,
  ) => {
    if (category) {
      window.dispatchEvent(
        new CustomEvent("select-pricing-tab", { detail: category }),
      );
    }

    if (location.pathname === "/") {
      e.preventDefault();
      const id = hash.replace("#", "");
      const el = document.getElementById(id) || document.getElementById("planes");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", hash);
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 bg-[#8FD14F]/5 blur-3xl pointer-events-none rounded-full" />

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
                bg-[#8FD14F] hover:bg-[#5FA22B] text-black font-bold text-sm
                shadow-[0_0_16px_rgba(143,209,79,0.25)] hover:shadow-[0_0_24px_rgba(143,209,79,0.4)]
                transition-all duration-200 active:scale-95 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-offset-2 focus-visible:ring-offset-black
              "
            >
              <MessageCircle className="w-4 h-4 fill-current stroke-none" />
              <span>{t("footer.cta_button")}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* 2. Footer Principal en 4 Columnas (con Empresa y Legal 2 col en móvil) */}
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Columna 1: Marca */}
          <div className="flex flex-col">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-[2px] w-fit"
              aria-label="NEXOL - Inicio"
            >
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8FD14F] shadow-[0_0_6px_rgba(143,209,79,0.5)]" />
              </span>
              <span className="font-bold text-xl uppercase text-white tracking-tight group-hover:text-[#8FD14F] transition-colors">
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
                className="inline-flex items-center gap-2 hover:text-[#8FD14F] transition-colors focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] w-fit"
              >
                <Phone className="w-3.5 h-3.5 text-[#8FD14F]" />
                <span>+505 8714 0989</span>
              </a>

              <a
                href="https://detdevs.com"
                className="inline-flex items-center gap-2 hover:text-[#8FD14F] transition-colors focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] w-fit"
              >
                <Globe className="w-3.5 h-3.5 text-[#8FD14F]" />
                <span>detdevs.com</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Productos */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8FD14F] font-bold mb-4 block">
              {t("footer.col_products")}
            </span>
            <nav aria-label={t("footer.col_products")}>
              <ul className="flex flex-col space-y-3 text-sm">
                <li>
                  <a
                    href="/#planes-pos"
                    onClick={(e) => handleAnchorClick(e, "#planes-pos", "pos")}
                    className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                  >
                    {t("footer.product_pos")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planes-cartera"
                    onClick={(e) => handleAnchorClick(e, "#planes-cartera", "cartera")}
                    className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                  >
                    {t("footer.product_cartera")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planes-citas"
                    onClick={(e) => handleAnchorClick(e, "#planes-citas", "citas")}
                    className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                  >
                    {t("footer.product_citas")}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planes-delivery"
                    onClick={(e) => handleAnchorClick(e, "#planes-delivery", "logistics")}
                    className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                  >
                    {t("footer.product_delivery")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Wrapper para Empresa y Legal: 2 columnas lado a lado en móvil, contents en lg */}
          <div className="grid grid-cols-2 gap-6 col-span-1 sm:col-span-2 lg:contents">
            {/* Columna 3: Empresa */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8FD14F] font-bold mb-4 block">
                {t("footer.col_company")}
              </span>
              <nav aria-label={t("footer.col_company")}>
                <ul className="flex flex-col space-y-3 text-sm">
                  <li>
                    <a
                      href="/#servicios"
                      onClick={(e) => handleAnchorClick(e, "#servicios")}
                      className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                    >
                      {t("footer.company_services")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#proyectos"
                      onClick={(e) => handleAnchorClick(e, "#proyectos")}
                      className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                    >
                      {t("footer.company_projects")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#planes"
                      onClick={(e) => handleAnchorClick(e, "#planes")}
                      className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                    >
                      {t("footer.company_plans")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#contacto"
                      onClick={(e) => handleAnchorClick(e, "#contacto")}
                      className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                    >
                      {t("footer.company_contact")}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Columna 4: Legal */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8FD14F] font-bold mb-4 block">
                {t("footer.col_legal")}
              </span>
              <nav aria-label={t("footer.col_legal")}>
                <ul className="flex flex-col space-y-3 text-sm">
                  <li>
                    <Link
                      to="/terminos"
                      className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                    >
                      {t("footer.terms")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacidad"
                      className="text-zinc-300 hover:text-[#8FD14F] focus-visible:text-[#8FD14F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] rounded-[2px] transition-colors inline-block"
                    >
                      {t("footer.privacy")}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Barra Inferior con protección de espacio contra el botón flotante */}
      <div className="border-t border-zinc-900 bg-[#040404]">
        <div className="max-w-7xl mx-auto px-6 py-6 pb-24 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">
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
