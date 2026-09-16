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
  // These routes keep their visual layer full-bleed. Each provides an explicit
  // foreground safe zone using the same header-offset variables, so the
  // document shell must not shift the scenery or flow controls a second time.
  const hasImmersiveFlow =
    pathname === "/" ||
    pathname === "/ontdek" ||
    pathname === "/inspiratie" ||
    pathname === "/jaarkalender";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div
        id="app-shell-content"
        className={`flex-1${hasImmersiveFlow ? " app-shell-content--immersive" : ""}`}
      >
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
