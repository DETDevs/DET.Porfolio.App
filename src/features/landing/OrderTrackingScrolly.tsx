import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import {
  Clock,
  Navigation,
  Bike,
  Store,
  Home,
  Zap,
  Wifi,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const OrderTrackingScrolly = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);

  // Direct DOM refs to avoid any React re-render during scroll (100% 60fps smooth scroll)
  const speedRef = useRef<HTMLSpanElement>(null);
  const etaRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const stageStepRef = useRef<HTMLSpanElement>(null);
  const stageLabelRef = useRef<HTMLSpanElement>(null);
  const stageTitleRef = useRef<HTMLHeadingElement>(null);
  const stageDescRef = useRef<HTMLParagraphElement>(null);
  const stepBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stepLabelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const currentStageIndexRef = useRef(0);

  const stages = t("tracking_scrolly.stages", { returnObjects: true }) as {
    id: string;
    label: string;
    step: string;
    title: string;
    desc: string;
  }[];

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const rider = riderRef.current;
    if (!section || !path || !rider) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const isMobile = window.innerWidth < 768;

    // Helper to update discrete stage UI directly in DOM (only executes when stage changes)
    const updateStageUI = (stageIdx: number) => {
      currentStageIndexRef.current = stageIdx;
      const stage = stages[stageIdx] || stages[0];
      if (!stage) return;

      if (stageStepRef.current) {
        stageStepRef.current.textContent = `Etapa ${stage.step} / 05`;
      }
      if (stageLabelRef.current) {
        stageLabelRef.current.textContent = stage.label;
      }
      if (stageTitleRef.current) {
        stageTitleRef.current.textContent = stage.title;
      }
      if (stageDescRef.current) {
        stageDescRef.current.textContent = stage.desc;
      }

      stepBarsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const isCompletedOrCurrent = i <= stageIdx;
        bar.className = `h-1.5 w-full rounded-[1px] ${
          isCompletedOrCurrent ? "bg-[#a3e635]" : "bg-zinc-800"
        }`;
      });

      stepLabelsRef.current.forEach((lbl, i) => {
        if (!lbl) return;
        const isCurrent = i === stageIdx;
        const isCompleted = i < stageIdx;
        lbl.className = `font-mono text-[9px] ${
          isCurrent
            ? "text-white font-bold"
            : isCompleted
            ? "text-[#a3e635]"
            : "text-zinc-600"
        }`;
      });
    };

    // Ensure initial stage UI is set
    updateStageUI(currentStageIndexRef.current);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: isMobile ? "+=180%" : "+=260%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // 1. Direct SVG stroke animation
          const drawOffset = pathLength * (1 - p);
          path.style.strokeDashoffset = `${drawOffset}`;

          // 2. Direct transform on rider
          const point = path.getPointAtLength(p * pathLength);
          const nextPoint = path.getPointAtLength(Math.min((p + 0.01) * pathLength, pathLength));
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
          rider.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) rotate(${angle}deg)`;

          // 3. Direct text update for progress percentage
          if (progressRef.current) {
            progressRef.current.textContent = `Progreso: ${Math.round(p * 100)}%`;
          }

          // 4. Direct text update for dynamic telemetry (speed & ETA)
          let speed = 0;
          let eta = 16;
          if (p < 0.15) {
            speed = 0;
            eta = 16;
          } else if (p >= 0.85) {
            speed = 0;
            eta = 0;
          } else {
            speed = Math.round(28 + Math.sin(p * Math.PI * 4) * 12);
            eta = Math.max(1, Math.round(16 * (1 - p)));
          }

          if (speedRef.current) {
            speedRef.current.textContent = `${speed} km/h`;
          }
          if (etaRef.current) {
            etaRef.current.textContent = `${eta} min`;
          }

          // 5. Discrete stage update ONLY when crossing stage boundary
          let stageIdx = 0;
          if (p >= 0.82) stageIdx = 4;
          else if (p >= 0.58) stageIdx = 3;
          else if (p >= 0.35) stageIdx = 2;
          else if (p >= 0.15) stageIdx = 1;
          else stageIdx = 0;

          if (stageIdx !== currentStageIndexRef.current) {
            updateStageUI(stageIdx);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [stages]);

  return (
    <section
      id="tracking"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col justify-center select-none border-t border-b border-zinc-800"
    >
      {/* Subtle architectural grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-full justify-between">
        {/* Section Header (Clean, no badges, no prefijo >) */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#a3e635] mb-2 block">
            {t("tracking_scrolly.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            {t("tracking_scrolly.title")}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
            {t("tracking_scrolly.subtitle")}
          </p>
        </div>

        {/* Interactive Layout: Map + Telemetry Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Map Simulation (7 Cols) */}
          <div className="lg:col-span-7 relative bg-[#0c0c0c] border border-zinc-800 rounded-[2px] p-4 sm:p-6 shadow-sm overflow-hidden aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
            {/* Map Roads / Neighborhood Grid */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              viewBox="0 0 800 450"
            >
              <line x1="50" y1="100" x2="750" y2="100" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="80" y1="220" x2="720" y2="220" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50" y1="360" x2="750" y2="360" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="200" y1="40" x2="200" y2="410" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="420" y1="40" x2="420" y2="410" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="620" y1="40" x2="620" y2="410" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="90" y="120" width="90" height="80" rx="2" fill="#18181b" opacity="0.6" />
              <rect x="220" y="120" width="180" height="80" rx="2" fill="#18181b" opacity="0.6" />
              <rect x="440" y="120" width="160" height="80" rx="2" fill="#18181b" opacity="0.6" />
              <rect x="90" y="240" width="90" height="100" rx="2" fill="#18181b" opacity="0.6" />
              <rect x="220" y="240" width="180" height="100" rx="2" fill="#18181b" opacity="0.6" />
              <rect x="440" y="240" width="160" height="100" rx="2" fill="#18181b" opacity="0.6" />
            </svg>

            {/* Dynamic Map Route SVG (Solid #a3e635, no glow filter) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 800 450"
            >
              {/* Inactive Path Background */}
              <path
                d="M 120 340 C 200 340, 220 220, 320 220 C 420 220, 440 120, 540 120 C 640 120, 680 200, 710 270"
                fill="none"
                stroke="#27272a"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Active Animated Route (Solid flat #a3e635) */}
              <path
                ref={pathRef}
                d="M 120 340 C 200 340, 220 220, 320 220 C 420 220, 440 120, 540 120 C 640 120, 680 200, 710 270"
                fill="none"
                stroke="#a3e635"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {/* Store / Restaurant Pin (Start - No glow/blur) */}
            <div
              className="absolute pointer-events-none flex flex-col items-center"
              style={{ left: "15%", top: "75%", transform: "translate(-50%, -50%)" }}
            >
              <div className="w-8 h-8 rounded-[2px] bg-[#121212] border border-zinc-700 flex items-center justify-center text-white shadow-sm">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded-[2px] bg-black border border-zinc-800 font-mono text-[9px] uppercase tracking-wider text-zinc-400 whitespace-nowrap">
                Comercio
              </span>
            </div>

            {/* Customer Pin (Destination - No glow/blur) */}
            <div
              className="absolute pointer-events-none flex flex-col items-center"
              style={{ left: "88.75%", top: "60%", transform: "translate(-50%, -50%)" }}
            >
              <div className="w-8 h-8 rounded-[2px] bg-[#121212] border border-zinc-700 flex items-center justify-center text-white shadow-sm">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded-[2px] bg-black border border-zinc-800 font-mono text-[9px] uppercase tracking-wider text-[#a3e635] whitespace-nowrap">
                Destino
              </span>
            </div>

            {/* Moving Rider Element (Flat Swiss, solid #a3e635) */}
            <div
              ref={riderRef}
              className="absolute top-0 left-0 pointer-events-none z-30 will-change-transform"
              style={{ transform: "translate(120px, 340px) translate(-50%, -50%)" }}
            >
              <div className="w-8 h-8 rounded-[2px] bg-[#a3e635] flex items-center justify-center text-black shadow-sm">
                <Bike className="w-4 h-4" />
              </div>
            </div>

            {/* Map Top Status */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-black border border-zinc-800 text-[10px] text-zinc-300 font-mono">
              <span className="w-1.5 h-1.5 bg-[#a3e635]" />
              <span>DISPATCH ENGINE · LIVE</span>
            </div>

            {/* Live Telemetry Pill */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-3 px-3 py-1 rounded-[2px] bg-black border border-zinc-800 text-[10px] text-zinc-300 font-mono">
              <div className="flex items-center gap-1 text-white">
                <Zap className="w-3 h-3 text-[#a3e635]" />
                <span ref={speedRef}>0 km/h</span>
              </div>
              <div className="w-px h-3 bg-zinc-800" />
              <div className="flex items-center gap-1 text-white">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span ref={etaRef}>16 min</span>
              </div>
            </div>
          </div>

          {/* Telemetry & Stage Stepper Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Stage Stepper Navigation */}
            <div className="bg-[#121212] border border-zinc-800 rounded-[2px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <span ref={stageStepRef} className="font-mono text-xs uppercase tracking-widest text-[#a3e635] font-bold">
                  Etapa {stages[0]?.step || "01"} / 05
                </span>
                <span ref={progressRef} className="font-mono text-xs text-zinc-500">
                  Progreso: 0%
                </span>
              </div>

              {/* Active Stage Details */}
              <div className="min-h-[120px] flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-2">
                  <span ref={stageLabelRef} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-900 text-[#a3e635] border border-zinc-800">
                    {stages[0]?.label}
                  </span>
                  <h3 ref={stageTitleRef} className="text-lg sm:text-xl font-bold uppercase text-white tracking-tight">
                    {stages[0]?.title}
                  </h3>
                </div>
                <p ref={stageDescRef} className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1">
                  {stages[0]?.desc}
                </p>
              </div>

              {/* 5-Step Progress Bar (No neon glow, instant DOM toggle without transition churn) */}
              <div className="grid grid-cols-5 gap-1.5 mt-5 pt-4 border-t border-zinc-800">
                {stages.map((stg, i) => {
                  const isCurrent = i === 0;
                  return (
                    <div key={stg.id} className="flex flex-col items-center gap-1">
                      <div
                        ref={(el) => {
                          stepBarsRef.current[i] = el;
                        }}
                        className={`h-1.5 w-full rounded-[1px] ${
                          isCurrent ? "bg-[#a3e635]" : "bg-zinc-800"
                        }`}
                      />
                      <span
                        ref={(el) => {
                          stepLabelsRef.current[i] = el;
                        }}
                        className={`font-mono text-[9px] ${
                          isCurrent ? "text-white font-bold" : "text-zinc-600"
                        }`}
                      >
                        {stg.step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Architecture Metrics (Plano, sin blur/glow) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-[2px] bg-[#121212] border border-zinc-800 flex items-center gap-3">
                <Wifi className="w-4 h-4 text-[#a3e635] shrink-0" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    WebSockets
                  </div>
                  <div className="font-mono text-xs font-bold text-white">Latencia 24ms</div>
                </div>
              </div>

              <div className="p-4 rounded-[2px] bg-[#121212] border border-zinc-800 flex items-center gap-3">
                <Navigation className="w-4 h-4 text-[#a3e635] shrink-0" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Mapbox GL
                  </div>
                  <div className="font-mono text-xs font-bold text-white">Interpolado 60fps</div>
                </div>
              </div>
            </div>

            {/* Scroll Instruction */}
            <div className="text-center font-mono text-[11px] text-zinc-500 flex items-center justify-center gap-2 pt-1 uppercase tracking-wider">
              <span>{t("tracking_scrolly.scroll_hint")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
