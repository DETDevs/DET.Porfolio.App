import { ChevronDown, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MaskLine } from "@/shared/ui/MaskLine";
import { scrollTo } from "@/shared/hooks/useLenis";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      aria-label="Hero Nexol"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 sm:pt-32 pb-8 sm:pb-12 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden bg-[#050505] selection:bg-[#8FD14F] selection:text-black"
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/70 to-black/95 lg:to-[#050505]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(143,209,79,0.06),transparent_55%)]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl my-auto py-8">
        {/* Architecture Engine Badge */}
        {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[11px] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#8FD14F] animate-pulse" />
          <span>{t("hero.architecture_engine", "Nexol Architecture Engine")}</span>
        </div> */}

        {/* Hero Headline with MaskLine */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white mb-6 leading-[1.03] tracking-tight">
          <MaskLine delay={0.1}>{t("hero.title_1")}</MaskLine>{" "}
          <br className="hidden sm:inline" />
          <MaskLine delay={0.25} className="text-[#8FD14F]">
            {t("hero.title_2")}
          </MaskLine>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-8 font-sans">
          {t(
            "hero.subtitle",
            "Diseñamos software a la medida de alto impacto. Facturación, inventarios, apps móviles y plataformas web en tiempo real.",
          )}
        </p>

        {/* Hero CTAs */}
        <div className="flex items-center flex-wrap gap-4">
          <button
            onClick={() => scrollTo("#planes", { offset: -60 })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8FD14F] hover:bg-[#5FA22B] text-black text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 shadow-[0_0_20px_rgba(143,209,79,0.25)] hover:shadow-[0_0_25px_rgba(143,209,79,0.4)] cursor-pointer border-none active:scale-95"
          >
            <span>{t("hero.cta_primary", "Ver Planes")}</span>
            <ArrowUpRight size={16} className="stroke-[2.5]" />
          </button>

          <button
            onClick={() => scrollTo("#servicios", { offset: 0 })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-medium border border-white/10 transition-colors duration-200 cursor-pointer backdrop-blur-md active:scale-95"
          >
            <span>{t("hero.cta_secondary", "Nuestros Servicios")}</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer hint with scroll arrow & mobile wordmark */}
      <div className="relative z-10 w-full flex flex-col justify-end pt-4">
        <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-white/5 pt-4">
          <div className="hidden sm:flex items-center gap-2">
            <span>Nexol © {new Date().getFullYear()}</span>
            <span className="text-zinc-600">/</span>
            <span>
              {t("hero.footer_tagline", "Desarrollo de Software a Medida")}
            </span>
          </div>

          <button
            onClick={() => scrollTo("#servicios", { offset: 0 })}
            className="mx-auto sm:mx-0 flex items-center gap-2 text-zinc-400 hover:text-[#8FD14F] transition-colors duration-200 text-xs font-mono cursor-pointer bg-transparent border-none"
          >
            <span>{t("hero.scroll_hint", "Scroll para explorar")}</span>
            <ChevronDown size={14} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
