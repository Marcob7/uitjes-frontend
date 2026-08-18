"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type AppFrameProps = {
  children: ReactNode;
};

export default function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      {!isHome ? <SiteHeader variant="default" /> : null}
      <div id="app-shell-content" className="flex-1">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
