"use client";

import type { ReactNode } from "react";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type AppFrameProps = {
  children: ReactNode;
};

export default function AppFrame({ children }: AppFrameProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="app-shell-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
