import type { LoginErrorCode } from "@/lib/authErrors";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function LoginErrorAlert({ code }: { code: LoginErrorCode }) {
  const { t } = useLocale();

  return (
    <p
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-900"
      role="alert"
    >
      {t(`auth.errors.${code}`)}
    </p>
  );
}
