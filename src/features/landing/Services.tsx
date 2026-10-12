import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAdaptivePin } from "@/shared/hooks/useAdaptivePin";
import { BASE_SERVICES, type ServiceSceneData } from "@/config/services";
import { scrollTo } from "@/shared/hooks/useLenis";
import { MaskLine } from "@/shared/ui/MaskLine";
import {
  SERVICE_ANIMS,
  buildTicketAnim,
  buildLedgerAnim,
  buildCalendarAnim,
  buildRouteAnim,
  buildBrowserAnim,
} from "./ServiceAnims";

gsap.registerPlugin(ScrollTrigger);

const EASE_OUT = "ease-[cubic-bezier(.16,1,.3,1)]";

/** Staggered entrance: delay only when entering, exit immediately. */
const delay = (isActive: boolean, ms: number) => (isActive ? `${ms}ms` : "0ms");

/** true once the element has meaningfully entered the viewport (sticky: it never resets) */
function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

interface CardProps {
  service: ServiceSceneData;
  index: number;
  total: number;
  onPlan: (category?: string, e?: React.MouseEvent) => void;
  sceneLabel: string;
  planLabel: string;
  waLabel: string;
}

const MobileServiceCard = ({
  service,
  index,
  total,
  onPlan,
  sceneLabel,
  planLabel,
  waLabel,
}: CardProps) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Anim = SERVICE_ANIMS[service.category];

  return (
    <div
      ref={ref}
      id={`service-card-${index}`}
      className="mobile-service-card flex flex-col gap-6 py-10 border-t border-white/10 first:border-t-0"
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {sceneLabel}{" "}
        <span className="text-[#8FD14F] font-bold">{service.id}</span> /{" "}
        {String(total).padStart(2, "0")}
      </div>

      <h3 className="text-[clamp(2rem,9vw,3rem)] font-black uppercase text-white tracking-tight leading-[1.02] break-words">
        {service.title}
      </h3>

      <div className="py-4">
        <Anim mode="once" active={inView} />
      </div>

      <p className="text-zinc-400 text-sm leading-relaxed font-sans max-w-md">
        {service.desc}
      </p>

      {service.price && (
        <div className="inline-flex self-start items-center px-3 py-1 rounded-full bg-[#8FD14F]/10 border border-[#8FD14F]/30 text-[#8FD14F] font-mono text-[11px] font-bold">
          {service.price}
        </div>
      )}

      <div className="flex items-center flex-wrap gap-3">
        <button
          onClick={(e) => onPlan(service.category, e)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-tight cursor-pointer border-none active:scale-95"
        >
          <span>{planLabel}</span>
          <ArrowUpRight size={13} className="stroke-[2.5]" />
        </button>
        <a
          href={`https://wa.me/50587140989?text=${encodeURIComponent(
            `Hola NEXOL, me gustaría cotizar el servicio de ${service.title}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-mono border border-white/10 transition-colors duration-200 no-underline cursor-pointer active:scale-95"
        >
          <span>{waLabel}</span>
          <ArrowUpRight size={12} className="text-[#8FD14F]" />
        </a>
      </div>
    </div>
  );
};

export const Services = () => {
  const { t, i18n } = useTranslation();
  const isEs = !i18n.language || i18n.language.startsWith("es");
  const pinned = useAdaptivePin();
  const containerRef = useRef<HTMLElement | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [activeScene, setActiveScene] = useState<number>(0);
  const sceneTimesRef = useRef<number[]>([]);
  const durationRef = useRef<number>(1);

  // Merge localized data with base service assets
  const services: ServiceSceneData[] = useMemo(() => {
    const localized = t("hero.slides", { returnObjects: true }) as
      | Partial<ServiceSceneData>[]
      | undefined;
    if (Array.isArray(localized) && localized.length > 0) {
      return BASE_SERVICES.map((base, idx) => ({
        ...base,
        ...(localized[idx] || {}),
        image: base.image,
        link: base.link,
        category: base.category,
      }));
    }
    return BASE_SERVICES;
  }, [t]);

  const total = services.length;
  const sceneLabel = t("services.scene_label", "Servicio");
  const planLabel = t("hero.cta_card", "Ver plan");
  const waLabel = t("hero.cta_whatsapp", "Cotizar por WhatsApp");

  const handlePlanClick = (category?: string, e?: React.MouseEvent) => {
    if (category) {
      window.dispatchEvent(
        new CustomEvent("select-pricing-tab", { detail: category })
      );
    }
    const targetId = category ? `planes-${category}` : "planes";
    const el =
      document.getElementById(targetId) || document.getElementById("planes");
    if (el) {
      if (e) e.preventDefault();
      scrollTo(`#${targetId}`, { offset: -90, duration: 1.2 });
      window.history.pushState(null, "", `#planes-${category || "pos"}`);
    }
  };

  const scrollToScene = (sceneIndex: number) => {
    if (!pinned) {
      const el = document.getElementById(`service-card-${sceneIndex}`);
      if (el) {
        scrollTo(el, { offset: -80, duration: 1.2 });
      }
      return;
    }

    if (stRef.current) {
      const st = stRef.current;
      const time = sceneTimesRef.current[sceneIndex] ?? 0;
      const progress = Math.min(1, Math.max(0, time / durationRef.current));
      const targetScroll = st.start + progress * (st.end - st.start);
      scrollTo(targetScroll, { duration: 1.0 });
    }
  };

  // Broadcast scene changes for lateral indicator and listen for jump events
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("service-scene-change", { detail: activeScene })
    );
  }, [activeScene]);

  useEffect(() => {
    const handleJump = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        scrollToScene(customEvent.detail);
      }
    };
    window.addEventListener("jump-to-service-scene", handleJump);
    return () => {
      window.removeEventListener("jump-to-service-scene", handleJump);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned, total]);

  // GSAP pinned timeline: vertical clip-path wipe between scenes + direct scrub of each micro-animation
  useEffect(() => {
    if (!pinned || !containerRef.current) {
      stRef.current = null;
      return;
    }

    const container = containerRef.current;
    const scenes = container.querySelectorAll<HTMLElement>(".service-scene");
    if (scenes.length === 0) return;

    const HOLD = 2.4; // hold time during which the micro-animation scrubs
    const WIPE = 0.9; // vertical curtain wipe time
    const TAIL = 0.4; // end buffer
    const totalUnits = HOLD + (scenes.length - 1) * (WIPE + HOLD) + TAIL;
    durationRef.current = totalUnits;

    const ctx = gsap.context(() => {
      // Set all scenes to clipped out except the first one
      gsap.set(scenes, { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 0 });
      gsap.set(scenes[0], { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 4.2)}px`,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const time = self.progress * totalUnits;
            let idx = 0;
            sceneTimesRef.current.forEach((fullyVisibleAt, i) => {
              if (i > 0 && time >= fullyVisibleAt - WIPE * 0.45) idx = i;
            });
            setActiveScene(idx);
          },
        },
      });

      stRef.current = tl.scrollTrigger || null;

      const times: number[] = [0];

      // Helper to attach animations directly to the scrub timeline
      const attachAnim = (sceneIdx: number, atTime: number) => {
        const animRoot = scenes[sceneIdx].querySelector<HTMLElement>(".service-anim-root");
        if (!animRoot) return;
        const sub = gsap.timeline();
        if (sceneIdx === 0) buildTicketAnim(sub, animRoot, isEs);
        else if (sceneIdx === 1) buildLedgerAnim(sub, animRoot, isEs);
        else if (sceneIdx === 2) buildCalendarAnim(sub, animRoot);
        else if (sceneIdx === 3) buildRouteAnim(sub, animRoot);
        else if (sceneIdx === 4) buildBrowserAnim(sub, animRoot);

        sub.duration(HOLD);
        tl.add(sub, atTime);
      };

      // Scene 0 starts at time 0
      attachAnim(0, 0);

      const ghost = (i: number) => scenes[i].querySelector<HTMLElement>(".ghost-num");
      const content = (i: number) => scenes[i].querySelector<HTMLElement>(".scene-content");

      const g0 = ghost(0);
      if (g0) tl.fromTo(g0, { yPercent: 6 }, { yPercent: -6, ease: "none", duration: HOLD }, 0);

      for (let i = 1; i < scenes.length; i++) {
        const start = HOLD + (i - 1) * (WIPE + HOLD);

        // Incoming scene wipes in
        tl.set(scenes[i], { autoAlpha: 1 }, start);
        tl.fromTo(
          scenes[i],
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: WIPE },
          start
        );

        // Outgoing scene dims and scales slightly down
        const prev = content(i - 1);
        if (prev) {
          tl.to(prev, { opacity: 0.25, scale: 0.97, ease: "none", duration: WIPE }, start);
        }
        tl.set(scenes[i - 1], { autoAlpha: 0 }, start + WIPE);

        times.push(start + WIPE);

        const gi = ghost(i);
        if (gi) {
          tl.fromTo(gi, { yPercent: 6 }, { yPercent: -6, ease: "none", duration: WIPE + HOLD }, start);
        }

        attachAnim(i, start + WIPE);
      }

      sceneTimesRef.current = times;
      tl.to({}, { duration: TAIL }, totalUnits - TAIL);
    }, container);

    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, [pinned, total, isEs]);

  return (
    <section
      ref={containerRef}
      id="servicios"
      aria-label="Servicios Nexol"
      className={
        pinned
          ? "relative w-full h-screen overflow-hidden bg-black select-none scroll-mt-28"
          : "relative w-full pt-20 pb-6 px-6 sm:px-10 bg-black scroll-mt-28"
      }
    >
      {pinned ? (
        <>
          {/* Section heading (fixed inside the pinned stage) */}
          <MaskLine
            as="h2"
            triggerOnScroll
            containerClassName="absolute top-24 left-6 sm:left-12 lg:left-16 z-40 pointer-events-none"
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500"
          >
            {t("services.title", "Lo que hacemos por tu negocio")}
          </MaskLine>

          {services.map((service, idx) => {
            const isActive = activeScene === idx;
            const Anim = SERVICE_ANIMS[service.category];
            return (
              <div
                key={service.id}
                className="service-scene absolute inset-0 bg-black flex items-center px-6 sm:px-12 lg:px-16 will-change-[clip-path]"
                style={{ zIndex: 10 + idx * 5 }}
              >
                {/* Ghost numeral */}
                <span
                  aria-hidden="true"
                  className="ghost-num absolute -right-[2vw] -bottom-[6vw] text-[34vw] font-black leading-none text-white/[0.035] select-none pointer-events-none will-change-transform"
                >
                  {service.id}
                </span>
                {/* Soft lime glow behind the animation */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55vw] h-[70vh] bg-[radial-gradient(ellipse_at_center,rgba(143,209,79,0.07),transparent_65%)] pointer-events-none" />

                <div className="scene-content relative w-full max-w-[1680px] mx-auto grid grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Text column: staggered entrance numeral → title → phrase → price → buttons */}
                  <div className="col-span-5 flex flex-col">
                    <div
                      className={`flex items-center gap-2 font-mono text-xs tracking-widest uppercase mb-5 transition-all duration-700 ${EASE_OUT} ${
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      }`}
                      style={{ transitionDelay: delay(isActive, 0) }}
                    >
                      <span className="text-zinc-500">{sceneLabel}</span>
                      <span className="text-[#8FD14F] font-bold text-sm">{service.id}</span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-500">{String(total).padStart(2, "0")}</span>
                    </div>

                    <div className="overflow-hidden pb-[0.1em]">
                      <h3
                        className={`text-[clamp(2.6rem,5.4vw,6rem)] font-black uppercase text-white tracking-tight leading-[1.02] transition-transform duration-[900ms] ${EASE_OUT} ${
                          isActive ? "translate-y-0" : "translate-y-[115%]"
                        }`}
                        style={{ transitionDelay: delay(isActive, 120) }}
                      >
                        {service.title}
                      </h3>
                    </div>

                    <p
                      className={`mt-6 max-w-md text-zinc-400 text-base leading-relaxed font-sans transition-all duration-700 ${EASE_OUT} ${
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: delay(isActive, 300) }}
                    >
                      {service.desc}
                    </p>

                    {service.price && (
                      <div
                        className={`mt-6 self-start inline-flex items-center px-3 py-1 rounded-full bg-[#8FD14F]/10 border border-[#8FD14F]/30 text-[#8FD14F] font-mono text-xs font-bold transition-all duration-700 ${EASE_OUT} ${
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                        style={{ transitionDelay: delay(isActive, 450) }}
                      >
                        {service.price}
                      </div>
                    )}

                    <div
                      className={`mt-6 flex items-center flex-wrap gap-3 transition-all duration-700 ${EASE_OUT} ${
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: delay(isActive, 600) }}
                    >
                      <button
                        onClick={(e) => handlePlanClick(service.category, e)}
                        tabIndex={isActive ? 0 : -1}
                        className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-[#8FD14F] text-black text-xs font-bold tracking-tight transition-colors duration-200 cursor-pointer border-none active:scale-95"
                      >
                        <span>{planLabel}</span>
                        <ArrowUpRight size={13} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                      <a
                        href={`https://wa.me/50587140989?text=${encodeURIComponent(
                          `Hola NEXOL, me gustaría cotizar el servicio de ${service.title}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isActive ? 0 : -1}
                        className="group inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-[#8FD14F] text-zinc-300 hover:text-black text-xs font-mono border border-white/10 hover:border-[#8FD14F] transition-colors duration-200 cursor-pointer no-underline active:scale-95"
                      >
                        <span>{waLabel}</span>
                        <ArrowUpRight size={12} className="text-[#8FD14F] group-hover:text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>

                  {/* Animation column: big, scrubbed with the scroll */}
                  <div className="col-span-7 flex items-center justify-center min-h-[60vh]">
                    <Anim mode="scrub" active={isActive} />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        /* MOBILE / TABLET / REDUCED MOTION: stacked, static flow */
        <div className="max-w-3xl mx-auto flex flex-col">
          <MaskLine
            as="h2"
            triggerOnScroll
            containerClassName="mb-8"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8FD14F]"
          >
            {t("services.title", "Lo que hacemos por tu negocio")}
          </MaskLine>
          {services.map((service, index) => (
            <MobileServiceCard
              key={service.id}
              service={service}
              index={index}
              total={total}
              onPlan={handlePlanClick}
              sceneLabel={sceneLabel}
              planLabel={planLabel}
              waLabel={waLabel}
            />
          ))}
        </div>
      )}
    </section>
  );
};
