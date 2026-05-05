"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

type InspirationContextLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function InspirationContextLink({
  href,
  className,
  children,
}: InspirationContextLinkProps) {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const resolvedHref = location
    ? `${href}?${new URLSearchParams({ location }).toString()}`
    : href;

  return (
    <Link href={resolvedHref} className={className}>
      {children}
    </Link>
  );
}
