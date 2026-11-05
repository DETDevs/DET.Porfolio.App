import React from "react";
import { twMerge } from "tailwind-merge";
import type { SectionProps } from "@/core/types";

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  sectionClassName = "",
  id,
  ...rest
}) => (
  <section
    id={id}
    className={twMerge(
      "py-[clamp(72px,9vw,160px)] scroll-mt-24",
      sectionClassName,
    )}
    {...rest}
  >
    <div
      className={twMerge(
        "w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] box-border",
        className,
      )}
    >
      {children}
    </div>
  </section>
);
