import { lazy, Suspense, useEffect } from "react";
import ReactGA from "react-ga4";
import { Navbar } from "@/features/layout/Navbar";
import { Footer } from "@/features/layout/Footer";
import { Hero } from "@/features/landing/Hero";
import { WhatsAppButton } from "@/shared/ui/WhatsAppButton";
import { ScrollProgress } from "@/shared/ui/ScrollProgress";
import { SectionNav } from "@/shared/ui/SectionNav";

const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

const Services = lazy(() =>
  import("@/features/landing/Services").then((m) => ({ default: m.Services })),
);
const Projects = lazy(() =>
  import("@/features/landing/Projects").then((m) => ({ default: m.Projects })),
);
const WhyUs = lazy(() =>
  import("@/features/landing/WhyUs").then((m) => ({ default: m.WhyUs })),
);
const OrderTrackingScrolly = lazy(() =>
  import("@/features/landing/OrderTrackingScrolly").then((m) => ({
    default: m.OrderTrackingScrolly,
  })),
);
const Pricing = lazy(() =>
  import("@/features/landing/Pricing").then((m) => ({ default: m.Pricing })),
);
const Contact = lazy(() =>
  import("@/features/landing/Contact").then((m) => ({ default: m.Contact })),
);
const FAQ = lazy(() =>
  import("@/features/landing/FAQ").then((m) => ({ default: m.FAQ })),
);

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  useEffect(() => {
    if (GA_ID) {
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname + window.location.search,
      });
    }

    // Refresh ScrollTrigger once dynamic suspense sections mount to ensure pin calculations are exact
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-zinc-200 selection:bg-[#a3e635] selection:text-black font-sans overflow-x-hidden">
      <ScrollProgress />
      <SectionNav />
      <Navbar />
      <main>
        <Hero />
        <Suspense>
          <Services />
          <Projects />
          <WhyUs />
          <OrderTrackingScrolly />
          <Pricing />
          <Contact />
          <FAQ />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;
