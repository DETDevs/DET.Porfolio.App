import { useRef, useEffect, useMemo, useState, useCallback } from "react";
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
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const OrderTrackingScrolly = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedContainerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef(0);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const isSimulatingRef = useRef(false);
  const simTweenRef = useRef<gsap.core.Tween | null>(null);

  // Direct DOM refs to avoid React re-renders during high-frequency scroll (60fps)
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

  // Scale references for SVG viewBox (800x450) vs container
  const scaleRef = useRef({ x: 1, y: 1 });

  // Memoize stages based on active language
  const stages = useMemo(
    () =>
      t("tracking_scrolly.stages", { returnObjects: true }) as {
        id: string;
        label: string;
        step: string;
        title: string;
        desc: string;
      }[],
    [i18n.language],
  );

  // Helper to update discrete stage UI directly in DOM
  const updateStageUI = useCallback((stageIdx: number) => {
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
      bar.className = `h-1.5 w-full rounded-[1px] transition-colors duration-200 ${
        isCompletedOrCurrent ? "bg-[#a3e635]" : "bg-zinc-800"
      }`;
    });

    stepLabelsRef.current.forEach((lbl, i) => {
      if (!lbl) return;
      const isCurrent = i === stageIdx;
      const isCompleted = i < stageIdx;
      lbl.className = `font-mono text-[9px] transition-colors duration-200 ${
        isCurrent
          ? "text-white font-bold"
          : isCompleted
          ? "text-[#a3e635]"
          : "text-zinc-600"
      }`;
    });
  }, [stages]);

  // Core progress application function: updates SVG stroke, rider position, telemetry, and stage UI
  const applyProgress = useCallback((rawProgress: number) => {
    const path = pathRef.current;
    const rider = riderRef.current;
    if (!path || !rider) return;

    const p = Math.max(0, Math.min(1, rawProgress));
    currentProgressRef.current = p;

    const pathLength = path.getTotalLength();

    // 1. SVG route drawing
    const drawOffset = pathLength * (1 - p);
    path.style.strokeDashoffset = `${drawOffset}`;

    // 2. Rider position & smooth rotation
    const currentDist = p * pathLength;
    const point = path.getPointAtLength(currentDist);
    const delta = 0.01 * pathLength;
    const prevPoint = path.getPointAtLength(Math.max(0, currentDist - delta));
    const nextPoint = path.getPointAtLength(Math.min(pathLength, currentDist + delta));
    const angle = Math.atan2(nextPoint.y - prevPoint.y, nextPoint.x - prevPoint.x) * (180 / Math.PI);

    const x = point.x * scaleRef.current.x;
    const y = point.y * scaleRef.current.y;
    rider.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;

    // 3. Progress percentage text
    if (progressRef.current) {
      progressRef.current.textContent = `Progreso: ${Math.round(p * 100)}%`;
    }

    // 4. Dynamic telemetry metrics
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

    // 5. Discrete stage update when boundary crossed
    let stageIdx = 0;
    if (p >= 0.82) stageIdx = 4;
    else if (p >= 0.58) stageIdx = 3;
    else if (p >= 0.35) stageIdx = 2;
    else if (p >= 0.15) stageIdx = 1;
    else stageIdx = 0;

    if (stageIdx !== currentStageIndexRef.current) {
      updateStageUI(stageIdx);
    }
  }, [updateStageUI]);

  // Stop active simulation
  const stopSimulation = useCallback(() => {
    if (simTweenRef.current) {
      simTweenRef.current.kill();
      simTweenRef.current = null;
    }
    isSimulatingRef.current = false;
    setIsSimulating(false);
  }, []);

  // Start live route simulation
  const startSimulation = useCallback(() => {
    stopSimulation();
    isSimulatingRef.current = true;
    setIsSimulating(true);

    const startP = currentProgressRef.current >= 0.98 ? 0 : currentProgressRef.current;
    currentProgressRef.current = startP;
    applyProgress(startP);

    const remainingDistance = 1 - startP;
    const duration = Math.max(2, remainingDistance * 6);

    const proxy = { p: startP };
    simTweenRef.current = gsap.to(proxy, {
      p: 1,
      duration,
      ease: "none",
      onUpdate: () => {
        applyProgress(proxy.p);
      },
      onComplete: () => {
        setIsSimulating(false);
        isSimulatingRef.current = false;
        simTweenRef.current = null;
      },
    });
  }, [stopSimulation, applyProgress]);

  // Toggle live simulation
  const toggleSimulation = useCallback(() => {
    if (isSimulatingRef.current) {
      stopSimulation();
    } else {
      startSimulation();
    }
  }, [stopSimulation, startSimulation]);

  // Navigate directly to a specific stage on user click
  const goToStage = useCallback((stageIdx: number) => {
    stopSimulation();
    const stageProgressMap = [0.0, 0.25, 0.48, 0.72, 1.0];
    const targetProgress = stageProgressMap[stageIdx] ?? 0;

    const proxy = { p: currentProgressRef.current };
    gsap.to(proxy, {
      p: targetProgress,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        applyProgress(proxy.p);
      },
    });
  }, [stopSimulation, applyProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinnedContainer = pinnedContainerRef.current;
    const path = pathRef.current;
    const rider = riderRef.current;
    const mapContainer = mapContainerRef.current;
    if (!section || !pinnedContainer || !path || !rider || !mapContainer) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const updateScale = () => {
      const rect = mapContainer.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        scaleRef.current = {
          x: rect.width / 800,
          y: rect.height / 450,
        };
      }
    };

    updateScale();
    applyProgress(currentProgressRef.current);
    rider.style.opacity = "1";

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
      applyProgress(currentProgressRef.current);
    });
    resizeObserver.observe(mapContainer);

    // Initial stage UI
    updateStageUI(currentStageIndexRef.current);

    const isMobile = window.innerWidth < 1024;

    // Seamless Pinning:
    // 1. trigger is `section` (in normal document flow, keeps relative positioning)
    // 2. pin is `pinnedContainer` (internal div, prevents React fiber DOM unmount conflicts)
    // 3. anticipatePin: 1 eliminates the 1-frame visual jump at entrance
    // 4. fastScrollEnd: true ensures clean instant snap to 100% on fast scroll exit
    // 5. scrub: true provides instant 1:1 scroll lock without floating inertia
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        pin: pinnedContainer,
        start: "top top",
        end: isMobile ? "+=140%" : "+=180%",
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (isSimulatingRef.current) {
            stopSimulation();
          }
          applyProgress(self.progress);
        },
      });
    }, section);

    return () => {
      resizeObserver.disconnect();
      stopSimulation();
      ctx.revert();
    };
  }, [applyProgress, updateStageUI, stopSimulation]);

  return (
    <section
      id="tracking"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white select-none border-t border-b border-zinc-800"
    >
      {/* Pinned Inner Container: React preserves <section> in tree while GSAP pins this container */}
      <div
        ref={pinnedContainerRef}
        className="w-full min-h-screen flex flex-col justify-center overflow-hidden relative"
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

        {/* Main Content Container: Centered, fits cleanly inside any viewport without vertical overflow */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 flex flex-col justify-center">
          {/* Section Header: Compact & elegant, no empty voids */}
          <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-5">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#a3e635] mb-1 block">
              {t("tracking_scrolly.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              {t("tracking_scrolly.title")}
            </h2>
            <p className="text-zinc-400 text-[11px] sm:text-xs mt-1 max-w-2xl mx-auto leading-relaxed hidden sm:block">
              {t("tracking_scrolly.subtitle")}
            </p>
          </div>

          {/* Interactive Layout: Map + Telemetry Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-center">
            {/* Map Simulation (7 Cols) */}
            <div
              ref={mapContainerRef}
              className="lg:col-span-7 relative bg-[#0c0c0c] border border-zinc-800 rounded-[2px] shadow-sm overflow-hidden h-[185px] sm:h-[250px] lg:h-auto lg:aspect-[16/9] flex items-center justify-center"
            >
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

              {/* Dynamic Map Route SVG */}
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

                {/* Active Animated Route */}
                <path
                  ref={pathRef}
                  d="M 120 340 C 200 340, 220 220, 320 220 C 420 220, 440 120, 540 120 C 640 120, 680 200, 710 270"
                  fill="none"
                  stroke="#a3e635"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              {/* Store / Restaurant Pin (Start) */}
              <div
                className="absolute pointer-events-none flex flex-col items-center"
                style={{ left: "15%", top: "75.56%", transform: "translate(-50%, -50%)" }}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-[#121212] border border-zinc-700 flex items-center justify-center text-white shadow-sm">
                  <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="mt-0.5 px-1 py-0.2 rounded-[2px] bg-black border border-zinc-800 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-zinc-400 whitespace-nowrap">
                  Comercio
                </span>
              </div>

              {/* Customer Pin (Destination) */}
              <div
                className="absolute pointer-events-none flex flex-col items-center"
                style={{ left: "88.75%", top: "60%", transform: "translate(-50%, -50%)" }}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-[#121212] border border-zinc-700 flex items-center justify-center text-white shadow-sm">
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="mt-0.5 px-1 py-0.2 rounded-[2px] bg-black border border-zinc-800 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#a3e635] whitespace-nowrap">
                  Destino
                </span>
              </div>

              {/* Moving Rider Element */}
              <div
                ref={riderRef}
                className="absolute top-0 left-0 pointer-events-none z-30 will-change-transform opacity-0 transition-opacity duration-200"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-[#a3e635] flex items-center justify-center text-black shadow-sm">
                  <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Map Top Status */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[2px] bg-black border border-zinc-800 text-[9px] sm:text-[10px] text-zinc-300 font-mono">
                <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse" />
                <span>DISPATCH ENGINE · LIVE</span>
              </div>

              {/* Simulation Action Button */}
              <button
                type="button"
                onClick={toggleSimulation}
                className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[2px] bg-black/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[9px] sm:text-[10px] text-zinc-300 hover:text-white font-mono transition-colors cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-3 h-3 text-[#a3e635]" />
                    <span>PAUSAR</span>
                  </>
                ) : currentProgressRef.current >= 0.98 ? (
                  <>
                    <RotateCcw className="w-3 h-3 text-[#a3e635]" />
                    <span>REINICIAR</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#a3e635]" />
                    <span>SIMULAR</span>
                  </>
                )}
              </button>

              {/* Live Telemetry Pill */}
              <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-2.5 px-2.5 py-1 rounded-[2px] bg-black border border-zinc-800 text-[9px] sm:text-[10px] text-zinc-300 font-mono">
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
            <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-4">
              {/* Stage Stepper Navigation */}
              <div className="bg-[#121212] border border-zinc-800 rounded-[2px] p-3.5 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2.5 sm:mb-3 border-b border-zinc-800 pb-2 sm:pb-2.5">
                  <span ref={stageStepRef} className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#a3e635] font-bold">
                    Etapa {stages[0]?.step || "01"} / 05
                  </span>
                  <span ref={progressRef} className="font-mono text-[11px] sm:text-xs text-zinc-500">
                    Progreso: 0%
                  </span>
                </div>

                {/* Active Stage Details */}
                <div className="min-h-[65px] sm:min-h-[85px] flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                    <span ref={stageLabelRef} className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-zinc-900 text-[#a3e635] border border-zinc-800">
                      {stages[0]?.label}
                    </span>
                    <h3 ref={stageTitleRef} className="text-sm sm:text-lg font-bold uppercase text-white tracking-tight">
                      {stages[0]?.title}
                    </h3>
                  </div>
                  <p ref={stageDescRef} className="text-zinc-400 text-[11px] sm:text-xs sm:leading-relaxed mt-0.5">
                    {stages[0]?.desc}
                  </p>
                </div>

                {/* 5-Step Interactive Progress Bar */}
                <div className="grid grid-cols-5 gap-1.5 mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-zinc-800">
                  {stages.map((stg, i) => {
                    const isCurrent = i === 0;
                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() => goToStage(i)}
                        className="flex flex-col items-center gap-1 p-0.5 rounded-[2px] hover:bg-zinc-900/60 transition-colors cursor-pointer group text-left"
                        title={`Ir a Etapa ${stg.step}: ${stg.label}`}
                      >
                        <div
                          ref={(el) => {
                            stepBarsRef.current[i] = el;
                          }}
                          className={`h-1.5 w-full rounded-[1px] ${
                            isCurrent ? "bg-[#a3e635]" : "bg-zinc-800 group-hover:bg-zinc-700"
                          }`}
                        />
                        <span
                          ref={(el) => {
                            stepLabelsRef.current[i] = el;
                          }}
                          className={`font-mono text-[8px] sm:text-[9px] ${
                            isCurrent ? "text-white font-bold" : "text-zinc-600 group-hover:text-zinc-400"
                          }`}
                        >
                          {stg.step}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Architecture Metrics */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 rounded-[2px] bg-[#121212] border border-zinc-800 flex items-center gap-2.5">
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3e635] shrink-0" />
                  <div>
                    <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500">
                      WebSockets
                    </div>
                    <div className="font-mono text-[11px] sm:text-xs font-bold text-white">Latencia 24ms</div>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-[2px] bg-[#121212] border border-zinc-800 flex items-center gap-2.5">
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3e635] shrink-0" />
                  <div>
                    <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500">
                      Mapbox GL
                    </div>
                    <div className="font-mono text-[11px] sm:text-xs font-bold text-white">Interpolado 60fps</div>
                  </div>
                </div>
              </div>

              {/* Instruction Hint */}
              <div className="text-center font-mono text-[10px] sm:text-[11px] text-zinc-500 flex items-center justify-center gap-2 uppercase tracking-wider">
                <span>{t("tracking_scrolly.scroll_hint")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
