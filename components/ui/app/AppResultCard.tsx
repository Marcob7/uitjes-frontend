"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { optimizeRemoteImageUrl, unwrapCssImageUrl } from "@/lib/remoteImage";
import { cn } from "@/lib/utils";

import { AppCard } from "./AppCard";

export type AppResultCardProps = {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  meta?: React.ReactNode;
  tags?: string[];
  badge?: string;
  ctaLabel?: string;
  onClick?: () => void;
  className?: string;
};

export function AppResultCard({
  title,
  description,
  image,
  href,
  meta,
  tags = [],
  badge,
  ctaLabel,
  onClick,
  className,
}: AppResultCardProps) {
  const imageSrc = image
    ? optimizeRemoteImageUrl(unwrapCssImageUrl(image), { width: 420, quality: 56 })
    : undefined;
  const content = (
    <AppCard
      as="article"
      variant="interactive"
      padding="sm"
      className={cn("group flex h-full flex-col gap-4 sm:flex-row sm:p-5", className)}
    >
      {imageSrc ? (
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-[1.35rem] bg-[#efe7dd] sm:h-28 sm:w-32">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 128px"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/8 via-transparent to-black/22" />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        {badge ? (
          <span className="inline-flex rounded-full bg-[#dff1c5] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#66873e]">
            {badge}
          </span>
        ) : null}
        <h3 className="mt-2 text-[1.45rem] font-semibold leading-tight tracking-[-0.045em] text-[#171511]">
          {title}
        </h3>
        {meta ? <div className="mt-2 text-sm text-[#6a6056]">{meta}</div> : null}
        {description ? (
          <p className="mt-3 text-sm leading-6 text-[#60574f]">{description}</p>
        ) : null}
        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#d9cfc4] bg-white px-3 py-1 text-xs text-[#5a5047]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {ctaLabel ? (
          <span className="mt-4 inline-flex text-sm font-semibold text-[#4d6630]">
            {ctaLabel} <span aria-hidden="true" className="ml-1">&rarr;</span>
          </span>
        ) : null}
      </div>
    </AppCard>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block h-full">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block h-full w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
