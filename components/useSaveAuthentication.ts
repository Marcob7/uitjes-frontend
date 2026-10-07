"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { useAuth } from "@/components/AuthProvider";

/**
 * Keeps save controls consistent without making cards responsible for auth.
 *
 * A save control always owns its click: it must not also open the card or
 * select a map result. The current auth flow has no supported return URL, so
 * unauthenticated saves continue through the established login route.
 */
export function useSaveAuthentication() {
  const router = useRouter();
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
        router.push("/login");
      }
    },
    [router, status, stopCardNavigation],
  );

  return {
    isAuthenticated,
    isChecking: status === "checking",
    redirectToLogin,
    stopCardNavigation,
  };
}
