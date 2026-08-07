"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { AppButton } from "@/components/ui/app";

export default function SearchRetryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div aria-live="polite">
      <AppButton
        type="button"
        variant="dark"
        disabled={isPending}
        onClick={() => startTransition(() => router.refresh())}
      >
        {isPending ? "Zoeken…" : "Opnieuw proberen"}
      </AppButton>
      {isPending ? <p className="mt-3 text-sm text-[#665d54]">Zoeken…</p> : null}
    </div>
  );
}
