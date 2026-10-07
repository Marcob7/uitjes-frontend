"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { AppButton } from "@/components/ui/app";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function SearchRetryButton() {
  const router = useRouter();
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  return (
    <div aria-live="polite">
      <AppButton
        type="button"
        variant="dark"
        disabled={isPending}
        onClick={() => startTransition(() => router.refresh())}
      >
        {isPending ? t("search.pending") : t("common.retry")}
      </AppButton>
      {isPending ? <p className="mt-3 text-sm text-[#665d54]">{t("search.pending")}</p> : null}
    </div>
  );
}
