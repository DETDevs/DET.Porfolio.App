import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { ArrowLeft } from "lucide-react";
import { terminosRaw, privacidadRaw } from "./legalContent";

interface LegalPageProps {
  type: "terminos" | "privacidad";
}

export const LegalPage = ({ type }: LegalPageProps) => {
  const navigate = useNavigate();

  const isTerminos = type === "terminos";
  const rawContent = isTerminos ? terminosRaw : privacidadRaw;

  const pageTitle = isTerminos
    ? "Términos y Condiciones | NEXOL"
    : "Política de Privacidad | NEXOL";

  const pageDescription = isTerminos
    ? "Términos y condiciones regulan el uso del sitio web y los servicios de software y membresía de NEXOL."
    : "Política de privacidad y protección de datos personales de NEXOL y la plataforma TrackDeli.";

  useEffect(() => {
    // Scroll to top on mount or type change
    window.scrollTo(0, 0);

    // Update document title
    const prevTitle = document.title;
    document.title = pageTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute("content", pageDescription);
    }

    // Ensure no noindex tag exists
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      metaRobots.setAttribute("content", "index, follow");
      document.head.appendChild(metaRobots);
    } else {
      metaRobots.setAttribute("content", "index, follow");
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute("content", prevDesc);
      }
    };
  }, [pageTitle, pageDescription]);

  // Parse markdown into HTML string
  const htmlContent = useMemo(() => {
    // Configure marked for consistent break and link behavior
    return marked.parse(rawContent, {
      gfm: true,
      breaks: false,
    }) as string;
  }, [rawContent]);

  // Intercept clicks on internal markdown links (e.g. [Política de Privacidad](/privacidad))
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;

    const href = target.getAttribute("href");
    if (href && href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1f2937] font-geist selection:bg-[#8FD14F]/30 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#e5e5e0] px-6 py-4">
        <div className="max-w-[760px] mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-zinc-900 group transition-opacity hover:opacity-80"
            aria-label="NEXOL - Volver al inicio"
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5FA22B] shadow-[0_0_6px_rgba(95,162,43,0.7)]" />
            </span>
            <span className="text-base font-bold tracking-tight text-zinc-900">
              Nexol
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-[#5FA22B] transition-colors py-1 px-3 rounded-full hover:bg-zinc-100"
          >
            <ArrowLeft size={14} />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[760px] mx-auto px-6 py-12 md:py-16">
        <article
          className="legal-prose"
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer Navigation */}
        <footer className="mt-16 pt-8 border-t border-[#e5e5e0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#5FA22B] hover:text-[#8FD14F] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver al inicio</span>
          </Link>

          <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
            {isTerminos ? (
              <Link
                to="/privacidad"
                className="hover:text-zinc-800 transition-colors underline underline-offset-2"
              >
                Ver Política de Privacidad
              </Link>
            ) : (
              <Link
                to="/terminos"
                className="hover:text-zinc-800 transition-colors underline underline-offset-2"
              >
                Ver Términos y Condiciones
              </Link>
            )}
            <span>·</span>
            <span>© {new Date().getFullYear()} NEXOL</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
