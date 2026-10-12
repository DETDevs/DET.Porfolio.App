import React from "react";
import { twMerge } from "tailwind-merge";
import type { SectionProps } from "@/core/types";

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  sectionClassName = "",
  id,
}) => (
  <section
    id={id}
    className={twMerge("py-16 md:py-24 scroll-mt-28", sectionClassName)}
  >
    <div className={`max-w-7xl mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </div>
  </section>
);
