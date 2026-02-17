import { lazy, Suspense, useEffect } from "react";
import ReactGA from "react-ga4";
import { Navbar } from "./features/layout/Navbar";
import { Footer } from "./features/layout/Footer";
import { Hero } from "./features/landing/Hero";
import { WhatsAppButton } from "./shared/ui/WhatsAppButton";

const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

const Services = lazy(() =>
  import("./features/landing/Services").then((m) => ({ default: m.Services })),
);
const Projects = lazy(() =>
  import("./features/landing/Projects").then((m) => ({ default: m.Projects })),
);
const WhyUs = lazy(() =>
  import("./features/landing/WhyUs").then((m) => ({ default: m.WhyUs })),
);
const Pricing = lazy(() =>
  import("./features/landing/Pricing").then((m) => ({ default: m.Pricing })),
);
const Contact = lazy(() =>
  import("./features/landing/Contact").then((m) => ({ default: m.Contact })),
);
const FAQ = lazy(() =>
  import("./features/landing/FAQ").then((m) => ({ default: m.FAQ })),
);

const App = () => {
  useEffect(() => {
    if (GA_ID) {
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname + window.location.search,
      });
    }
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-violet-500/30 font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Suspense>
          <Services />
          <Projects />
          <WhyUs />
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
