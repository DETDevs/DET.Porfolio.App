import { useState, useEffect, lazy, Suspense } from "react";
import { Navbar } from "@/features/layout/Navbar";
import { Hero } from "@/features/landing/Hero";
import { Services } from "@/features/landing/Services";
import { Industries } from "@/features/landing/Industries";
import { useLenisSmoothScroll } from "@/shared/hooks/useLenis";
import { SectionNav } from "@/shared/ui/SectionNav";

// Lazy Load Heavy Below-the-Fold Sections
const Projects = lazy(() =>
  import("@/features/landing/Projects").then((m) => ({ default: m.Projects })),
);
const Process = lazy(() =>
  import("@/features/landing/Process").then((m) => ({ default: m.Process })),
);
const WhyUs = lazy(() =>
  import("@/features/landing/WhyUs").then((m) => ({ default: m.WhyUs })),
);
const Pricing = lazy(() =>
  import("@/features/landing/Pricing").then((m) => ({ default: m.Pricing })),
);
const FAQ = lazy(() =>
  import("@/features/landing/FAQ").then((m) => ({ default: m.FAQ })),
);
const Contact = lazy(() =>
  import("@/features/landing/Contact").then((m) => ({ default: m.Contact })),
);
const Footer = lazy(() =>
  import("@/features/layout/Footer").then((m) => ({ default: m.Footer })),
);

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Smooth scrolling (Lenis + GSAP ScrollTrigger)
  useLenisSmoothScroll();

  // Escuchar si el modal de proyecto está abierto para ocultar navbar y scroll-to-top
  useEffect(() => {
    const handleModalToggle = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      setIsProjectModalOpen(!!custom.detail?.open);
    };
    window.addEventListener("project-modal-toggle", handleModalToggle);
    return () =>
      window.removeEventListener("project-modal-toggle", handleModalToggle);
  }, []);

  // Analytics Initialization (Deferred for Performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      import("react-ga4").then((ReactGA) => {
        const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || "G-XXXXXXXXXX";
        ReactGA.default.initialize(GA_MEASUREMENT_ID);
        ReactGA.default.send({
          hitType: "pageview",
          page: window.location.pathname,
        });
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Control Back to Top visibility
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-rosa-niebla text-azul-tinta selection:bg-azul-tinta selection:text-rosa-niebla relative overflow-x-clip">
      <Navbar />
      {!isProjectModalOpen && <SectionNav />}

      <main className="relative z-10">
        <Hero />
        <Services />
        <Industries />

        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-rosa-niebla">
              <div className="w-8 h-8 border-2 border-esmeralda-oscura border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Projects />
          <Process />
          <WhyUs />
          <Pricing />
          <FAQ />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Back to Top Button (oculto si el modal está abierto) */}
      {!isProjectModalOpen && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-azul-tinta border border-rosa-niebla/20 text-rosa-niebla shadow-lg hover:bg-esmeralda-oscura hover:text-blanco transition-all duration-300 group cursor-pointer ${
            showBackToTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
          aria-label="Volver arriba"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-y-0.5 transition-transform"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;
