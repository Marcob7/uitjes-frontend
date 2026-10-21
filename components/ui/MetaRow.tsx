import type { ReactNode } from "react";

export type MetaRowProps = {
  label: ReactNode;
  value: ReactNode;
};

export function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className="grid gap-1 border-b border-[#e2e5df] px-5 py-3.5 last:border-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="text-sm text-[#70776f]">{label}</dt>
      <dd className="text-sm font-semibold leading-6 text-[#25382e]">{value}</dd>
    </div>
  );
}
