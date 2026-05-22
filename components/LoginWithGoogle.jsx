"use client";

import { getApiBase } from "@/lib/api";

export default function LoginWithGoogle() {
  function handleLogin() {
    window.location.href = `${getApiBase()}/accounts/google/login/?process=login`;
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
    >
      Login met Google
    </button>
  );
}
