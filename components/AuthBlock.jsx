"use client";

import { useEffect, useState } from "react";
import { apiGetAuth, getApiBase } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import JwtLoginForm from "@/components/JwtLoginForm";
import LoginWithGoogle from "@/components/LoginWithGoogle";

export default function AuthBlock() {
  const { isAuthenticated, logout: logoutJwt, status, user } = useAuth();
  const [sessionMe, setSessionMe] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    if (status === "checking") return;

    if (isAuthenticated) {
      setSessionMe(null);
      setSessionLoading(false);
      return;
    }

    apiGetAuth("/api/me/")
      .then((data) => setSessionMe(data?.user || null))
      .finally(() => setSessionLoading(false));
  }, [isAuthenticated, status]);

  function logoutGoogle() {
    window.location.href = `${getApiBase()}/accounts/logout/`;
  }

  if (status === "checking" || sessionLoading) {
    return <p role="status" aria-live="polite">Account laden</p>;
  }

  if (!isAuthenticated && !sessionMe) {
    return (
      <div className="mb-5 grid gap-5 rounded-[24px] border border-white/70 bg-white/70 p-5 shadow-[0_18px_48px_rgba(57,43,27,0.08)]">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.025em] text-neutral-950">
            Inloggen met e-mail/gebruikersnaam
          </h2>
          <div className="mt-4">
            <JwtLoginForm />
          </div>
        </div>

        <div className="grid gap-3 border-t border-neutral-200 pt-5">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-neutral-950">
            Inloggen met Google
          </h2>
          <LoginWithGoogle />
        </div>
      </div>
    );
  }

  const displayUser = user || sessionMe;
  const isJwtUser = Boolean(user);

  return (
    <div className="mb-5 rounded-[24px] border border-white/70 bg-white/70 p-5 shadow-[0_18px_48px_rgba(57,43,27,0.08)]">
      <div className="text-sm text-neutral-700">
        Ingelogd als: <b>{displayUser.username || displayUser.email}</b>
      </div>
      <button
        type="button"
        onClick={isJwtUser ? logoutJwt : logoutGoogle}
        className="mt-3 inline-flex min-h-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
      >
        Uitloggen
      </button>
    </div>
  );
}
