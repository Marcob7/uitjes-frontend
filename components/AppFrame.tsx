"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { withoutLocalePrefix } from "@/lib/i18n/config";

type AppFrameProps = {
  children: ReactNode;
};

export default function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname();
  const routePathname = withoutLocalePrefix(pathname);
  // These routes keep their visual layer full-bleed. Each provides an explicit
  // foreground safe zone using the same header-offset variables, so the
  // document shell must not shift the scenery or flow controls a second time.
  const hasImmersiveFlow =
    routePathname === "/" ||
    routePathname === "/ontdek" ||
    routePathname === "/inspiratie" ||
    routePathname === "/jaarkalender";

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
