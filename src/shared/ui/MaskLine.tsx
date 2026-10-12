import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MaskLineProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p";
  delay?: number;
  duration?: number;
  triggerOnScroll?: boolean;
  yPercent?: number;
}

export const MaskLine: React.FC<MaskLineProps> = ({
  children,
  className = "",
  containerClassName = "",
  as: Component = "span",
  delay = 0,
  duration = 0.85,
  triggerOnScroll = false,
  yPercent = 110,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!innerRef.current) return;

    const el = innerRef.current;
    gsap.set(el, { yPercent });

    let ctx: gsap.Context;

    if (triggerOnScroll && containerRef.current) {
      ctx = gsap.context(() => {
        gsap.to(el, {
          yPercent: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }, containerRef);
    } else {
      ctx = gsap.context(() => {
        gsap.to(el, {
          yPercent: 0,
          duration,
          delay,
          ease: "power3.out",
        });
      }, containerRef);
    }

    return () => {
      ctx.revert();
    };
  }, [delay, duration, triggerOnScroll, yPercent]);

  return (
    <Component
      // @ts-expect-error ref flexibility for dynamic HTML tag
      ref={containerRef}
      className={`inline-block overflow-hidden align-top leading-tight ${containerClassName}`}
    >
      <span
        ref={innerRef}
        className={`inline-block will-change-transform ${className}`}
      >
        {children}
      </span>
    </Component>
  );
};
