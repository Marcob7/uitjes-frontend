import * as React from "react";

import { cn } from "@/lib/utils";

type SectionHeaderLevel = "h1" | "h2" | "h3";
type SectionHeaderAlign = "left" | "center";

export type SectionHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  id?: string;
  as?: SectionHeaderLevel;
  align?: SectionHeaderAlign;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  descriptionClassName?: string;
};

/** A semantic section heading with optional supporting copy; visual tone remains feature-owned. */
export function SectionHeader({
  title,
  description,
  eyebrow,
  id,
  as: Heading = "h2",
  align = "left",
  className,
  eyebrowClassName,
  titleClassName,
  titleStyle,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? <p className={eyebrowClassName}>{eyebrow}</p> : null}
      <Heading id={id} className={titleClassName} style={titleStyle}>
        {title}
      </Heading>
      {description ? <p className={descriptionClassName}>{description}</p> : null}
    </div>
  );
}
