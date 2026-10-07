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
    className={twMerge("py-20 md:py-28 scroll-mt-20", sectionClassName)}
  >
    <div className={`max-w-7xl mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </div>
  </section>
);
