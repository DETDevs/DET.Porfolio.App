import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";

/**
 * Micro-animations for the Services scenes. Pure code (HTML/SVG + GSAP), no images.
 *
 * In desktop pinned mode:
 *  - Timelines are built directly and scrubbed synchronously with the ScrollTrigger pin.
 *  - Both forward and reverse scrubbing smoothly advance and rewind numbers, paths, stamps, and blocks.
 *
 * In mobile / once mode:
 *  - Triggered when the card intersects the viewport, plays to completion.
 */

export type AnimMode = "scrub" | "once";

export interface AnimProps {
  mode: AnimMode;
  active: boolean;
}

const LIME = "#8FD14F";
const pad2 = (n: number) => String(Math.max(0, Math.round(n))).padStart(2, "0");

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useIsEs = () => {
  const { i18n } = useTranslation();
  return !i18n.language || i18n.language.startsWith("es");
};

/* ───────────────────────── 1. POS: thermal ticket ───────────────────────── */

export const TICKET_ROWS: [string, number][] = [
  ["ITEM 01", 2.5],
  ["ITEM 02", 4.0],
  ["ITEM 03", 1.75],
  ["ITEM 04", 6.25],
];

export function buildTicketAnim(tl: gsap.core.Timeline, root: HTMLElement, _es: boolean = true) {
  const paper = root.querySelector<HTMLElement>(".t-paper");
  const rows = root.querySelectorAll<HTMLElement>(".t-row");
  const totalEl = root.querySelector<HTMLElement>(".t-total");
  const stamp = root.querySelector<HTMLElement>(".t-stamp");
  if (!paper || !totalEl) return;

  const counter = { val: 0 };
  const updateCounter = () => {
    totalEl.textContent = counter.val.toFixed(2);
  };

  // Initial state setup
  tl.set(paper, { clipPath: "inset(0% 0% 100% 0%)", y: -18 });
  tl.set(rows, { opacity: 0, x: -14 });
  tl.set(stamp, { opacity: 0, scale: 2.4, rotation: -32 });
  tl.set(counter, { val: 0, onUpdate: updateCounter });

  // 1. Paper feeds down from the printer slot
  tl.to(paper, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 2.2, ease: "none" }, 0.05);

  // 2. Individual items print, adding up to the total
  let runningSum = 0;
  rows.forEach((row, i) => {
    const at = 0.25 + i * 0.42;
    runningSum += TICKET_ROWS[i][1];
    const targetSum = runningSum;
    tl.to(row, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, at);
    tl.to(counter, { val: targetSum, duration: 0.35, ease: "power1.out", onUpdate: updateCounter }, at + 0.05);
  });

  // 3. Physical "COBRADO" / "PAID" stamp drops with bounce
  if (stamp) {
    tl.to(stamp, { opacity: 1, scale: 1, rotation: -12, duration: 0.45, ease: "back.out(2.4)" }, 2.05);
  }
}

export const TicketAnim = ({ mode, active }: AnimProps) => {
  const es = useIsEs();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const finalTotal = TICKET_ROWS.reduce((a, [, p]) => a + p, 0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "scrub") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      buildTicketAnim(tl, root, es);

      if (prefersReduced()) {
        tl.progress(1).pause();
      } else if (active) {
        tl.play(0);
      } else {
        tl.pause(0);
      }
    }, root);

    return () => ctx.revert();
  }, [mode, active, es]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="service-anim-root service-anim-ticket relative w-[min(88vw,540px)] mx-auto font-mono select-none"
    >
      {/* printer slot */}
      <div className="relative z-10 h-3 rounded-full bg-white/10 border border-white/15" />
      <div
        className="t-paper -mt-1 bg-black border border-[#8FD14F]/35 px-7 pt-8 pb-6 text-base sm:text-lg text-zinc-300 shadow-[0_0_80px_rgba(143,209,79,0.08)]"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="flex items-center justify-between text-xs tracking-[0.3em] text-zinc-500 uppercase">
          <span>Ticket</span>
          <span>#0042</span>
        </div>
        <div className="my-4 border-t border-dashed border-white/15" />
        <div className="flex flex-col gap-4 min-h-[190px]">
          {TICKET_ROWS.map(([name, price]) => (
            <div key={name} className="t-row flex items-center justify-between opacity-0">
              <span>{name}</span>
              <span className="text-white tabular-nums">{price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="my-4 border-t border-dashed border-white/15" />
        <div className="flex items-end justify-between">
          <span className="text-xs tracking-[0.3em] text-zinc-500 uppercase">Total</span>
          <span className="text-5xl font-bold tabular-nums" style={{ color: LIME }}>
            <span className="text-2xl mr-1 opacity-70">$</span>
            <span className="t-total inline-block min-w-[4.4ch] text-right">{finalTotal.toFixed(2)}</span>
          </span>
        </div>
      </div>
      <div
        className="t-stamp absolute right-4 bottom-16 px-4 py-1.5 border-[3px] text-2xl font-black tracking-[0.2em] uppercase pointer-events-none opacity-0"
        style={{ color: LIME, borderColor: LIME, transform: "rotate(-12deg)" }}
      >
        {es ? "Cobrado" : "Paid"}
      </div>
    </div>
  );
};

/* ───────────────────────── 2. Cartera: balance down to zero ───────────────────────── */

export const LEDGER_PAYMENTS = [180, 150, 150];
export const LEDGER_START = LEDGER_PAYMENTS.reduce((a, b) => a + b, 0);

export function buildLedgerAnim(tl: gsap.core.Timeline, root: HTMLElement, _es: boolean = true) {
  const balEl = root.querySelector<HTMLElement>(".l-balance");
  const bar = root.querySelector<HTMLElement>(".l-bar");
  const chips = root.querySelectorAll<HTMLElement>(".l-chip");
  const badge = root.querySelector<HTMLElement>(".l-badge");
  if (!balEl || !bar) return;

  const counter = { val: LEDGER_START };
  const updateBal = () => {
    balEl.textContent = String(Math.round(counter.val));
  };

  // Initial state setup
  tl.set(bar, { scaleX: 0, transformOrigin: "left center" });
  tl.set(chips, { opacity: 0, x: 40 });
  tl.set(badge, { opacity: 0, scale: 0.3, rotation: -6 });
  tl.set(counter, { val: LEDGER_START, onUpdate: updateBal });

  // 3 Payments reduce the balance
  let remaining = LEDGER_START;
  chips.forEach((chip, i) => {
    const at = 0.25 + i * 0.65;
    remaining -= LEDGER_PAYMENTS[i];
    const targetRem = remaining;
    const progressFrac = (LEDGER_START - targetRem) / LEDGER_START;

    tl.to(chip, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }, at);
    tl.to(counter, { val: targetRem, duration: 0.45, ease: "power1.out", onUpdate: updateBal }, at + 0.1);
    tl.to(bar, { scaleX: progressFrac, duration: 0.45, ease: "power1.out" }, at + 0.1);
  });

  // "SALDADO" / "SETTLED" badge pops in
  if (badge) {
    tl.to(badge, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)" }, 2.25);
  }
}

export const LedgerAnim = ({ mode, active }: AnimProps) => {
  const es = useIsEs();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "scrub") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      buildLedgerAnim(tl, root, es);

      if (prefersReduced()) {
        tl.progress(1).pause();
      } else if (active) {
        tl.play(0);
      } else {
        tl.pause(0);
      }
    }, root);

    return () => ctx.revert();
  }, [mode, active, es]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="service-anim-root service-anim-ledger relative w-[min(88vw,660px)] mx-auto font-mono select-none"
    >
      <div className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-3">
        {es ? "Saldo pendiente" : "Outstanding balance"}
      </div>
      <div className="flex items-baseline gap-3 text-white">
        <span className="text-4xl" style={{ color: LIME }}>
          $
        </span>
        <span className="l-balance inline-block min-w-[3ch] text-[clamp(5rem,12vw,9rem)] font-bold leading-none tabular-nums">
          {LEDGER_START}
        </span>
        <span
          className="l-badge ml-auto self-center px-4 py-1.5 border-[3px] text-lg font-black tracking-[0.2em] uppercase opacity-0"
          style={{ color: LIME, borderColor: LIME, transform: "rotate(-6deg)" }}
        >
          {es ? "Saldado" : "Settled"}
        </span>
      </div>

      <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div className="l-bar h-full w-full rounded-full origin-left" style={{ background: LIME, transform: "scaleX(0)" }} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {LEDGER_PAYMENTS.map((p, i) => (
          <div
            key={i}
            className="l-chip flex items-center justify-between border border-white/10 px-5 py-3.5 text-base text-zinc-300 opacity-0"
          >
            <span className="text-zinc-500">
              {es ? "Abono" : "Payment"} 0{i + 1}
            </span>
            <span className="tabular-nums" style={{ color: LIME }}>
              − ${p}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────────────────────── 3. Citas: weekly calendar filling up ───────────────────────── */

export const CAL_FILLED = [1, 4, 6, 9, 11, 13, 17, 18];
export const CAL_COLS = 5;
export const CAL_ROWS = 4;

export function buildCalendarAnim(tl: gsap.core.Timeline, root: HTMLElement) {
  const slots = root.querySelectorAll<HTMLElement>(".c-slot-filled");
  const fills = root.querySelectorAll<HTMLElement>(".c-fill");
  const cursor = root.querySelector<HTMLElement>(".c-cursor");
  if (!slots.length || !fills.length) return;

  const cx = (el: HTMLElement) => el.offsetLeft + el.offsetWidth / 2;
  const cy = (el: HTMLElement) => el.offsetTop + el.offsetHeight / 2;

  // Initial state setup
  tl.set(fills, { opacity: 0, scale: 0.3 });
  if (cursor && slots[0]) {
    tl.set(cursor, { opacity: 0, xPercent: -50, yPercent: -50, x: () => cx(slots[0]), y: () => cy(slots[0]) });
  }

  // Cursor appears
  if (cursor) {
    tl.to(cursor, { opacity: 1, duration: 0.2 }, 0.1);
  }

  // Cursor moves through slots and stamps them with lime
  slots.forEach((slot, k) => {
    const at = 0.25 + k * 0.23;
    if (cursor) {
      tl.to(cursor, { x: () => cx(slot), y: () => cy(slot), duration: 0.18, ease: "power1.inOut" }, at);
    }
    if (fills[k]) {
      tl.to(fills[k], { opacity: 0.95, scale: 1, duration: 0.22, ease: "back.out(2)" }, at + 0.12);
    }
  });
}

export const CalendarAnim = ({ mode, active }: AnimProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("es") ? "es" : "en";
  const rootRef = useRef<HTMLDivElement | null>(null);

  const days = Array.from({ length: CAL_COLS }, (_, i) =>
    new Intl.DateTimeFormat(lang, { weekday: "short" })
      .format(new Date(2024, 0, 1 + i))
      .replace(".", "")
      .toUpperCase()
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "scrub") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      buildCalendarAnim(tl, root);

      if (prefersReduced()) {
        tl.progress(1).pause();
      } else if (active) {
        tl.play(0);
      } else {
        tl.pause(0);
      }
    }, root);

    return () => ctx.revert();
  }, [mode, active, lang]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="service-anim-root service-anim-calendar w-[min(90vw,740px)] mx-auto font-mono select-none"
    >
      <div className="grid grid-cols-5 gap-3 mb-3">
        {days.map((d, i) => (
          <div key={i} className="text-center text-xs tracking-widest text-zinc-500">
            {d}
          </div>
        ))}
      </div>
      <div className="relative grid grid-cols-5 gap-3">
        {Array.from({ length: CAL_COLS * CAL_ROWS }, (_, i) => {
          const filled = CAL_FILLED.indexOf(i) >= 0;
          return (
            <div
              key={i}
              className={`${filled ? "c-slot-filled " : ""}relative h-[clamp(44px,9vh,84px)] border border-white/10 overflow-hidden`}
            >
              {filled && (
                <div className="c-fill absolute inset-[4px] opacity-0" style={{ background: LIME }} />
              )}
            </div>
          );
        })}
        <div
          className="c-cursor absolute top-0 left-0 w-7 h-7 rounded-full border-2 pointer-events-none opacity-0"
          style={{ borderColor: "#fff", boxShadow: "0 0 18px rgba(255,255,255,0.45)" }}
        />
      </div>
    </div>
  );
};

/* ───────────────────────── 4. Delivery: route with a moving dot ───────────────────────── */

export const ROUTE_D = "M60 245 C 150 245, 120 130, 205 150 S 330 205, 340 70";
export const ROUTE_MINUTES = 18;

export function buildRouteAnim(tl: gsap.core.Timeline, root: HTMLElement) {
  const path = root.querySelector<SVGPathElement>(".r-path");
  const dot = root.querySelector<SVGGElement>(".r-dot");
  const end = root.querySelector<SVGGElement>(".r-end");
  const start = root.querySelector<SVGGElement>(".r-start");
  const ring = root.querySelector<SVGCircleElement>(".r-ring");
  const minEl = root.querySelector<HTMLElement>(".r-min");
  if (!path || !dot) return;

  const len = path.getTotalLength ? path.getTotalLength() : 350;
  const tracker = { p: 0 };

  const updateRoute = () => {
    const p = Math.max(0, Math.min(1, tracker.p));
    path.style.strokeDashoffset = String(1 - p);
    try {
      const pt = path.getPointAtLength(p * len);
      gsap.set(dot, { x: pt.x, y: pt.y });
    } catch {
      // fallback
    }
    if (minEl) {
      const remainingMin = Math.round(ROUTE_MINUTES * (1 - p));
      minEl.textContent = pad2(remainingMin);
    }
  };

  // Initial state setup
  path.style.strokeDasharray = "1";
  path.style.strokeDashoffset = "1";
  tl.set(tracker, { p: 0, onUpdate: updateRoute });
  tl.set(dot, { opacity: 0 });
  if (ring) tl.set(ring, { opacity: 0, scale: 0.6 });
  if (start && end) {
    tl.set([start, end], { opacity: 0, scale: 0.4, transformOrigin: "50% 100%" });
    tl.to([start, end], { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.1);
  }

  // Dot appears at start
  tl.to(dot, { opacity: 1, duration: 0.2 }, 0.3);

  // Path draws and dot follows route
  tl.to(tracker, { p: 1, duration: 1.8, ease: "power1.inOut", onUpdate: updateRoute }, 0.4);

  // Arrival ping
  if (ring) {
    tl.to(ring, { opacity: 0.8, scale: 2.2, duration: 0.5, ease: "power2.out" }, 2.2);
  }
}

export const RouteAnim = ({ mode, active }: AnimProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "scrub") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      buildRouteAnim(tl, root);

      if (prefersReduced()) {
        tl.progress(1).pause();
      } else if (active) {
        tl.play(0);
      } else {
        tl.pause(0);
      }
    }, root);

    return () => ctx.revert();
  }, [mode, active]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="service-anim-root service-anim-route relative w-[min(92vw,880px)] mx-auto select-none"
    >
      <div className="absolute top-0 left-2 z-10 font-mono">
        <div className="r-min-wrap flex items-baseline gap-2 text-white">
          <span className="r-min text-[clamp(3.5rem,8vw,6rem)] font-bold leading-none tabular-nums inline-block min-w-[2ch]">
            18
          </span>
          <span className="text-sm tracking-[0.3em] uppercase text-zinc-500">min</span>
        </div>
      </div>
      <svg viewBox="0 0 400 300" className="w-full h-auto overflow-visible">
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
          {[50, 100, 150, 200, 250].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
          ))}
          {[80, 160, 240, 320].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />
          ))}
        </g>

        <path d={ROUTE_D} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        <path
          className="r-path"
          d={ROUTE_D}
          fill="none"
          stroke={LIME}
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ strokeDashoffset: 1 }}
        />

        <g className="r-start opacity-0">
          <circle cx="60" cy="245" r="14" fill="none" stroke="rgba(255,255,255,0.3)" />
          <circle cx="60" cy="245" r="6" fill="#fff" />
        </g>
        <g className="r-end opacity-0">
          <circle className="r-ring opacity-0" cx="340" cy="70" r="14" fill="none" stroke={LIME} />
          <circle cx="340" cy="70" r="14" fill="none" stroke={LIME} opacity="0.6" />
          <circle cx="340" cy="70" r="6" fill={LIME} />
        </g>

        <g className="r-dot opacity-0">
          <circle r="13" fill={LIME} opacity="0.22" />
          <circle r="6.5" fill={LIME} />
        </g>
      </svg>
    </div>
  );
};

/* ───────────────────────── 5. Web: browser built block by block ───────────────────────── */

export function buildBrowserAnim(tl: gsap.core.Timeline, root: HTMLElement) {
  const frame = root.querySelector<HTMLElement>(".b-frame");
  const bar = root.querySelector<HTMLElement>(".b-bar");
  const blocks = root.querySelectorAll<HTMLElement>(".b-block");
  const glint = root.querySelector<HTMLElement>(".b-glint");
  if (!frame) return;

  // Initial state setup
  tl.set(frame, { clipPath: "inset(0% 0% 100% 0%)" });
  if (bar) tl.set(bar, { opacity: 0, scaleX: 0, transformOrigin: "left center" });
  tl.set(blocks, { opacity: 0, y: 18 });
  if (glint) tl.set(glint, { xPercent: -150, opacity: 0 });

  // 1. Browser window unfolds open
  tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.out" }, 0.1);

  // 2. Address bar fills
  if (bar) {
    tl.to(bar, { opacity: 1, scaleX: 1, duration: 0.35, ease: "power1.out" }, 0.4);
  }

  // 3. Hero banner block enters
  if (blocks[0]) {
    tl.to(blocks[0], { opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }, 0.65);
  }

  // 4. Feature cards stagger in
  const cards = [blocks[1], blocks[2], blocks[3]].filter(Boolean);
  if (cards.length) {
    tl.to(cards, { opacity: 1, y: 0, stagger: 0.12, duration: 0.3, ease: "back.out(1.6)" }, 0.95);
  }

  // 5. Action button pops in
  if (blocks[4]) {
    tl.to(blocks[4], { opacity: 1, y: 0, duration: 0.28, ease: "back.out(2)" }, 1.35);
  }

  // 6. Premium light sweep / glint across the finished website
  if (glint) {
    tl.fromTo(glint, { xPercent: -150, opacity: 0.9 }, { xPercent: 450, opacity: 0.9, duration: 0.75, ease: "power2.inOut" }, 1.6);
  }
}

export const BrowserAnim = ({ mode, active }: AnimProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "scrub") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      buildBrowserAnim(tl, root);

      if (prefersReduced()) {
        tl.progress(1).pause();
      } else if (active) {
        tl.play(0);
      } else {
        tl.pause(0);
      }
    }, root);

    return () => ctx.revert();
  }, [mode, active]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="service-anim-root service-anim-web w-[min(92vw,820px)] mx-auto select-none"
    >
      <div
        className="b-frame relative overflow-hidden border border-white/15 bg-black"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
          <span className="w-3 h-3 rounded-full bg-white/20" />
          <span className="w-3 h-3 rounded-full bg-white/20" />
          <span className="w-3 h-3 rounded-full bg-white/20" />
          <div className="b-bar ml-4 h-6 flex-1 rounded-full bg-white/10 opacity-0" />
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div
            className="b-block h-[clamp(96px,17vh,160px)] px-7 flex flex-col justify-center gap-3 opacity-0"
            style={{ background: "rgba(143,209,79,0.14)", border: "1px solid rgba(143,209,79,0.4)" }}
          >
            <div className="h-4 w-3/5 rounded-full" style={{ background: LIME }} />
            <div className="h-2.5 w-2/5 rounded-full bg-white/25" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="b-block h-[clamp(80px,14vh,130px)] border border-white/15 p-4 flex flex-col gap-3 opacity-0"
              >
                <div className="h-6 w-6 rounded-sm" style={{ background: LIME, opacity: 0.8 }} />
                <div className="h-2.5 w-4/5 rounded-full bg-white/20" />
                <div className="h-2.5 w-3/5 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
          <div className="b-block h-9 w-36 rounded-full opacity-0" style={{ background: LIME }} />
        </div>
        {/* light sweep across the finished page */}
        <div
          className="b-glint absolute inset-y-0 left-0 w-1/4 pointer-events-none opacity-0"
          style={{
            background:
              "linear-gradient(100deg, transparent, rgba(143,209,79,0.28), transparent)",
          }}
        />
      </div>
    </div>
  );
};

export const SERVICE_ANIMS = {
  pos: TicketAnim,
  cartera: LedgerAnim,
  citas: CalendarAnim,
  logistics: RouteAnim,
  web: BrowserAnim,
} as const;
