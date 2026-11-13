"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname } from "@/lib/i18n/config";

/**
 * Keeps save controls consistent without making cards responsible for auth.
 *
 * A save control always owns its click: it must not also open the card or
 * select a map result. An internal returnTo keeps the visitor's exact route
 * (including its locale and query) without repeating the save action.
 */
export function useSaveAuthentication() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const { isAuthenticated, status } = useAuth();

  const stopCardNavigation = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const redirectToLogin = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      stopCardNavigation(event);

      if (status !== "checking") {
        const query = searchParams.toString();
        const returnTo = `${pathname}${query ? `?${query}` : ""}${window.location.hash}`;
        router.push(`${localePathname("/login", locale)}?returnTo=${encodeURIComponent(returnTo)}`);
      }
    },
    [locale, pathname, router, searchParams, status, stopCardNavigation],
  );

  return {
    isAuthenticated,
    isChecking: status === "checking",
    redirectToLogin,
    stopCardNavigation,
  };
}
