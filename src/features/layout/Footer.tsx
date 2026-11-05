import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CONTACT_INFO } from "@/config/constants";
import { scrollTo } from "@/shared/hooks/useLenis";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61587114746247",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/det.devs/",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@detdevs",
  },
] as const;

export const Footer = () => {
  const { t } = useTranslation();

  const handleScrollLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollTo(href, { offset: -96 });
    }
  };

  return (
    <footer className="bg-azul-profundo text-rosa-niebla relative overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] box-border">
        {/* Main Footer Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-b border-rosa-niebla/15">
          {/* Col 1: Brand Info (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(0);
              }}
              aria-label="NEXOL, ir al inicio"
              className="inline-flex items-baseline font-bricolage font-extrabold text-[28px] tracking-[-0.04em] text-rosa-niebla no-underline"
            >
              nexol<span className="text-esmeralda-clara">.</span>
            </a>
            <p className="text-texto-azul text-sm leading-relaxed max-w-sm">
              {t(
                "footer.brand_tagline",
                "Software a la medida y sistemas para tu negocio. Hecho en Nicaragua.",
              )}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-rosa-niebla/10 border border-rosa-niebla/20 flex items-center justify-center text-rosa-niebla hover:text-esmeralda-clara hover:border-esmeralda-clara hover:bg-rosa-niebla/15 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.name === "Facebook" && (
                    <FacebookIcon className="w-4 h-4" />
                  )}
                  {social.name === "Instagram" && (
                    <InstagramIcon className="w-4 h-4" />
                  )}
                  {social.name === "TikTok" && (
                    <TikTokIcon className="w-4 h-4" />
                  )}
                  {social.name !== "Facebook" &&
                    social.name !== "Instagram" &&
                    social.name !== "TikTok" && (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs text-texto-azul-muted font-medium">
              {t("footer.col_company", "Empresa")}
            </h4>
            <ul className="space-y-2.5 text-sm text-texto-azul list-none m-0 p-0">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(0);
                  }}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("nav.home", "Inicio")}
                </a>
              </li>
              <li>
                <a
                  href="#servicios"
                  onClick={(e) => handleScrollLink(e, "#servicios")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("nav.services", "Servicios")}
                </a>
              </li>
              <li>
                <a
                  href="#proyectos"
                  onClick={(e) => handleScrollLink(e, "#proyectos")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("nav.projects", "Proyectos")}
                </a>
              </li>
              <li>
                <a
                  href="#planes"
                  onClick={(e) => handleScrollLink(e, "#planes")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("nav.pricing", "Planes")}
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  onClick={(e) => handleScrollLink(e, "#contacto")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("nav.contact", "Contacto")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs text-texto-azul-muted font-medium">
              {t("footer.col_products", "Productos")}
            </h4>
            <ul className="space-y-2.5 text-sm text-texto-azul list-none m-0 p-0">
              <li>
                <a
                  href="#svc-pos"
                  onClick={(e) => handleScrollLink(e, "#svc-pos")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("footer.product_pos", "NEXOL POS")}
                </a>
              </li>
              <li>
                <a
                  href="#svc-cobros"
                  onClick={(e) => handleScrollLink(e, "#svc-cobros")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("footer.product_cartera", "NEXOL Cobros")}
                </a>
              </li>
              <li>
                <a
                  href="#svc-citas"
                  onClick={(e) => handleScrollLink(e, "#svc-citas")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("footer.product_citas", "NEXOL Citas")}
                </a>
              </li>
              <li>
                <a
                  href="#svc-delivery"
                  onClick={(e) => handleScrollLink(e, "#svc-delivery")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("footer.product_delivery", "NEXOL Delivery")}
                </a>
              </li>
              <li>
                <a
                  href="#svc-web"
                  onClick={(e) => handleScrollLink(e, "#svc-web")}
                  className="hover:text-esmeralda-clara transition-colors no-underline text-texto-azul"
                >
                  {t("services.cards.web.title", "Páginas web y sistemas propios")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs text-texto-azul-muted font-medium">
              {t("contact.location_label", "Ubicación")}
            </h4>
            <div className="space-y-2.5 text-sm text-texto-azul">
              <p className="m-0">{CONTACT_INFO.location}</p>
              {CONTACT_INFO.email && (
                <p className="m-0">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-rosa-niebla hover:text-esmeralda-clara transition-colors no-underline"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </p>
              )}
              <p className="m-0 font-mono text-xs text-texto-azul-muted pt-1">
                {CONTACT_INFO.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-azul-footer-bar py-6">
        <div className="w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] box-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-texto-azul-muted font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-esmeralda-clara" />
            <span>
              {t("footer.crafted", "Software hecho en Managua, Nicaragua")}
            </span>
          </div>
          <div>
            © {new Date().getFullYear()} NEXOL.{" "}
            {t("footer.rights", "Todos los derechos reservados.")}
          </div>
        </div>
      </div>
    </footer>
  );
};
