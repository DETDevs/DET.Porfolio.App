import { lazy, Suspense } from "react";
import { Navbar } from "./features/layout/Navbar";
import { Footer } from "./features/layout/Footer";
import { Hero } from "./features/landing/Hero";

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

const App = () => {
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
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
