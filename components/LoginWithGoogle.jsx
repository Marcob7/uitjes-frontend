"use client";

import { getApiBase } from "@/lib/api";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getGoogleLoginHref } from "@/lib/authReturnTo";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.15c1.84-1.7 2.9-4.2 2.9-7.29Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.35l-3.15-2.52c-.87.58-1.99.92-3.28.92-2.53 0-4.67-1.71-5.44-4.01H3.31v2.6A9.72 9.72 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.56 13.79a5.85 5.85 0 0 1 0-3.58v-2.6H3.31a9.75 9.75 0 0 0 0 8.78l3.25-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.2c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.81 3.27 14.62 2.25 12 2.25a9.72 9.72 0 0 0-8.69 5.36l3.25 2.6C7.33 7.91 9.47 6.2 12 6.2Z"
      />
    </svg>
  );
}

export default function LoginWithGoogle({ onLoginAttempt, returnTo }) {
  const { t } = useLocale();
  function handleLogin() {
    onLoginAttempt?.();
    window.location.href = getGoogleLoginHref(getApiBase(), window.location.origin, returnTo);
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
    >
      <GoogleIcon />
      {t("auth.googleButton")}
    </button>
  );
}
