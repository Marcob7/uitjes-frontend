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
    routePathname === "/jaarkalender" ||
    routePathname === "/zoeken";

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#app-shell-content"
        className="sr-only fixed left-4 top-4 z-[1300] rounded-full bg-[#171511] px-4 py-3 text-sm font-semibold text-white shadow-lg focus:not-sr-only focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#005FCC]"
      >
        Ga naar hoofdinhoud
      </a>
      <SiteHeader />
      <div
        id="app-shell-content"
        tabIndex={-1}
        className={`flex-1${hasImmersiveFlow ? " app-shell-content--immersive" : ""}`}
      >
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
