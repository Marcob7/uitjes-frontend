"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname, withoutLocalePrefix } from "@/lib/i18n/config";

type NavigationItem = {
  href: string;
  label: string;
  icon?: "search";
};

type NavBarProps = {
  position?: "absolute" | "fixed";
};

/** Content contrast required by the surface directly behind the navbar. */
type NavbarContrast = "on-dark" | "on-light";

const navbarContrastAttribute = "data-navbar-contrast";

function getRouteDefaultContrast(pathname: string): NavbarContrast {
  // The home hero is the only route whose first surface is dark. All existing
  // inner-page headers are designed for the dark navbar content variant.
  return pathname === "/" ? "on-dark" : "on-light";
}

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="3.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m10 10 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function NavBar({ position = "absolute" }: NavBarProps) {
  const pathname = usePathname();
  const unlocalizedPathname = withoutLocalePrefix(pathname);
  const { locale, messages } = useLocale();
  const { isAuthenticated, status } = useAuth();
  const searchNavigationItem: NavigationItem = {
    href: "/zoeken",
    label: messages.navigation.search,
    icon: "search",
  };
  const navigationItems: NavigationItem[] = [
    { href: "/", label: messages.navigation.home },
    { href: "/ontdek", label: messages.navigation.explore },
    searchNavigationItem,
    { href: "/event-details", label: messages.navigation.events },
    { href: "/inspiratie", label: messages.navigation.inspiration },
    { href: "/jaarkalender", label: messages.navigation.calendar },
    { href: "/festivals/kalender", label: messages.navigation.festivals },
    { href: "/faq", label: messages.navigation.faq },
  ];
  const desktopNavigationItems = navigationItems.filter(
    (item) => item.href !== searchNavigationItem.href,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const routeDefaultContrast = getRouteDefaultContrast(unlocalizedPathname);
  const [detectedContrast, setDetectedContrast] = useState<{
    pathname: string;
    value: NavbarContrast;
  }>({ pathname, value: routeDefaultContrast });
  const contrast =
    detectedContrast.pathname === pathname
      ? detectedContrast.value
      : routeDefaultContrast;
  const isOnDark = contrast === "on-dark";

  // Navigation can also happen through browser history or another control on
  // the page. Keeping this here makes menu cleanup independent of a link's
  // individual click handler and prevents a stale mobile overlay after routes.
  useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu, pathname]);

  useEffect(() => {
    const defaultContrast = getRouteDefaultContrast(unlocalizedPathname);
    const zones = Array.from(
      document.querySelectorAll<HTMLElement>(`[${navbarContrastAttribute}]`),
    );

    setDetectedContrast((current) =>
      current.pathname === pathname && current.value === defaultContrast
        ? current
        : { pathname, value: defaultContrast },
    );

    if (!zones.length) return;

    let observer: IntersectionObserver | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const intersectingZones = new Set<HTMLElement>();

    const observeAtNavbar = () => {
      observer?.disconnect();
      intersectingZones.clear();

      const navbar = document.querySelector<HTMLElement>("[data-site-navbar]");
      const navbarRect = navbar?.getBoundingClientRect();
      const detectionY = Math.round(
        (navbarRect?.top ?? 16) + (navbarRect?.height ?? 40) / 2,
      );
      const detectionBandHeight = 2;
      const bottomMargin = Math.max(
        window.innerHeight - detectionY - detectionBandHeight,
        0,
      );

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const zone = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              intersectingZones.add(zone);
            } else {
              intersectingZones.delete(zone);
            }
          });

          // Nested zones (such as the Agenda card) occur after their parent
          // in document order, so they correctly take precedence when both
          // meet the navbar's small detection band.
          const activeZone = zones.filter((zone) => intersectingZones.has(zone)).at(-1);
          const zoneContrast = activeZone?.dataset.navbarContrast;
          const value: NavbarContrast =
            zoneContrast === "on-dark" || zoneContrast === "on-light"
              ? zoneContrast
              : defaultContrast;

          setDetectedContrast((current) =>
            current.pathname === pathname && current.value === value
              ? current
              : { pathname, value },
          );
        },
        {
          rootMargin: `-${detectionY}px 0px -${bottomMargin}px 0px`,
          threshold: 0,
        },
      );

      zones.forEach((zone) => observer?.observe(zone));
    };

    observeAtNavbar();
    const navbar = document.querySelector<HTMLElement>("[data-site-navbar]");
    if (navbar && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(observeAtNavbar);
      resizeObserver.observe(navbar);
    }

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
    };
  }, [pathname]);

  return (
    <header
      data-site-navbar
      className={`${position} inset-x-0 top-0 z-[1100] px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 md:pt-[max(1.125rem,env(safe-area-inset-top))]`}
    >
      <div className="mx-auto flex w-full max-w-[1150px] items-center justify-between gap-4">
        <Link
          href={localePathname("/", locale)}
          onClick={closeMobileMenu}
          className="group inline-flex shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          aria-label={messages.navigation.homeAria}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-[1.04]">
            <Image
              src="/images/uitjesplatform_logo_transparent.svg"
              alt=""
              aria-hidden="true"
              width={732}
              height={565}
              className="h-auto w-full"
              priority
            />
          </span>
          <span
            className={`whitespace-nowrap text-[15px] font-bold tracking-[-0.035em] sm:text-[16px] ${
              isOnDark
                ? "text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.24)]"
                : "text-[#171b1c]"
            }`}
          >
            DOEN<span className={isOnDark ? "text-white/80" : "text-[#171b1c]/68"}>.</span>
          </span>
        </Link>

        <nav aria-label={messages.navigation.main} className="hidden min-w-0 flex-1 lg:block">
          <ul className="flex items-center justify-center gap-[clamp(1rem,2.1vw,2rem)]">
            {desktopNavigationItems.map((item) => {
              const active = isCurrentPath(unlocalizedPathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={localePathname(item.href, locale)}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex items-center gap-1.5 py-2 text-[13px] font-medium leading-none tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${
                      active
                        ? isOnDark
                          ? "text-white focus-visible:ring-white/90"
                          : "text-[#171b1c] focus-visible:ring-[#171b1c]/70"
                        : isOnDark
                          ? "text-white/67 hover:text-white focus-visible:ring-white/90"
                          : "text-[#171b1c]/72 hover:text-[#171b1c] focus-visible:ring-[#171b1c]/70"
                    }`}
                  >
                    {item.icon === "search" ? <SearchIcon /> : null}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 lg:gap-4">
          <Link
            href={localePathname(searchNavigationItem.href, locale)}
            onClick={closeMobileMenu}
            aria-current={
              isCurrentPath(unlocalizedPathname, searchNavigationItem.href)
                ? "page"
                : undefined
            }
            className={`hidden h-[38px] items-center gap-1.5 px-1.5 text-[13px] font-medium leading-none tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent lg:inline-flex ${
              isCurrentPath(unlocalizedPathname, searchNavigationItem.href)
                ? isOnDark
                  ? "text-white focus-visible:ring-white/90"
                  : "text-[#171b1c] focus-visible:ring-[#171b1c]/70"
                : isOnDark
                  ? "text-white/67 hover:text-white focus-visible:ring-white/90"
                  : "text-[#171b1c]/72 hover:text-[#171b1c] focus-visible:ring-[#171b1c]/70"
            }`}
          >
            <SearchIcon />
            {searchNavigationItem.label}
          </Link>

          <Link
            href={localePathname(isAuthenticated ? "/saved" : "/login", locale)}
            onClick={closeMobileMenu}
            aria-current={isAuthenticated && unlocalizedPathname === "/saved" ? "page" : undefined}
            className="inline-flex h-[38px] items-center justify-center rounded-full bg-[#f1f2f2] px-4 text-[13px] font-semibold text-[#131719] shadow-[0_8px_22px_rgba(0,0,0,0.13)] outline-none transition duration-200 hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.19)] focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          >
            {status === "checking" || !isAuthenticated ? messages.navigation.login : messages.navigation.saved}
          </Link>

          <div className={isOnDark ? "text-white" : "text-[#171b1c]"}>
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? messages.navigation.closeMenu : messages.navigation.openMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="home-navigation-menu"
            className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border outline-none backdrop-blur-sm transition focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent lg:hidden ${
              isOnDark
                ? "border-white/28 bg-white/10 text-white hover:bg-white/18 focus-visible:ring-white/90"
                : "border-[#171b1c]/14 bg-white/72 text-[#171b1c] hover:bg-white focus-visible:ring-[#171b1c]/70"
            }`}
          >
            <span className="sr-only">
              {mobileMenuOpen ? messages.navigation.closeMenu : messages.navigation.openMenu}
            </span>
            {mobileMenuOpen ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m3 3 10 10M13 3 3 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 4h12M2 8h12M2 12h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          id="home-navigation-menu"
          className="mx-auto mt-3 max-w-[1150px] rounded-[1.35rem] border border-white/15 bg-[#061218]/78 p-2 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label={messages.navigation.mobileMain}>
            <ul className="grid gap-1">
              {navigationItems.map((item) => {
                const active = isCurrentPath(unlocalizedPathname, item.href);

                return (
                  <li key={`mobile-${item.href}`}>
                    <Link
                      href={localePathname(item.href, locale)}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMobileMenu}
                      className={`flex min-h-11 items-center gap-2 rounded-[0.95rem] px-4 text-[15px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/90 ${
                        active
                          ? "bg-white text-[#101617]"
                          : "text-white/82 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.icon === "search" ? <SearchIcon /> : null}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-1 border-t border-white/12 pt-1">
              <LanguageSwitcher compact />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
