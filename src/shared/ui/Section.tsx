import React from "react";
import type { SectionProps } from "../../core/types";

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id,
}) => (
  <section id={id} className="py-20 md:py-28 scroll-mt-20">
    <div className={`max-w-7xl mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </div>
  </section>
);
