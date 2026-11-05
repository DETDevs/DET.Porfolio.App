import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface MaskedSegment {
  text: string;
  className?: string;
}

/**
 * Groups `[data-mask-word]` elements inside `container` by their visual line (`offsetTop`)
 * so each visual line rises together from below its overflow-hidden mask.
 */
export function groupWordsByVisualLine(container: HTMLElement): HTMLElement[][] {
  const words = Array.from(
    container.querySelectorAll<HTMLElement>("[data-mask-word]"),
  );
  if (words.length === 0) return [];

  const lines: { top: number; els: HTMLElement[] }[] = [];
  for (const w of words) {
    const parent = w.parentElement || w;
    const top = parent.offsetTop;
    const existing = lines.find((l) => Math.abs(l.top - top) <= 8);
    if (existing) {
      existing.els.push(w);
    } else {
      lines.push({ top, els: [w] });
    }
  }
  return lines.map((l) => l.els);
}

/**
 * Renders text segments split into masked words so natural responsive wrapping
 * is preserved while allowing line-by-line masked reveal animations.
 */
export const MaskedWords: React.FC<{ segments: MaskedSegment[] }> = ({
  segments,
}) => {
  return (
    <>
      {segments.map((seg, sIdx) => {
        const words = seg.text.trim().split(/\s+/).filter(Boolean);
        return (
          <span key={sIdx} className={seg.className}>
            {words.map((word, wIdx) => {
              const isLastWordInAll =
                sIdx === segments.length - 1 && wIdx === words.length - 1;
              return (
                <React.Fragment key={wIdx}>
                  <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
                    <span
                      data-mask-word
                      className="inline-block will-change-transform"
                    >
                      {word}
                    </span>
                  </span>
                  {!isLastWordInAll && " "}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </>
  );
};

interface SectionTitleProps {
  id?: string;
  as?: "h1" | "h2";
  className?: string;
  segments: MaskedSegment[];
  /** If true, caller controls the GSAP timeline (e.g. Hero); otherwise animates on scroll (`once: true`). */
  manualTrigger?: boolean;
  onTimelineReady?: (lines: HTMLElement[][], el: HTMLHeadingElement) => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  id,
  as: Tag = "h2",
  className = "",
  segments,
  manualTrigger = false,
  onTimelineReady,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    if (manualTrigger) {
      if (onTimelineReady) {
        onTimelineReady(groupWordsByVisualLine(el), el);
      }
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const words = el.querySelectorAll<HTMLElement>("[data-mask-word]");
      gsap.set(words, { clearProps: "all", yPercent: 0, opacity: 1 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lineGroups = groupWordsByVisualLine(el);
      if (lineGroups.length === 0) return;

      const allWords = lineGroups.flat();
      gsap.set(allWords, { yPercent: 110, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          once: true,
        },
      });

      lineGroups.forEach((group, idx) => {
        tl.to(
          group,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          idx * 0.08,
        );
      });
    });

    return () => mm.revert();
  }, [segments, manualTrigger]);

  return (
    <Tag ref={headingRef} id={id} className={className}>
      <MaskedWords segments={segments} />
    </Tag>
  );
};

