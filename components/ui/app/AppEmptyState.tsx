"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { AppButton } from "./AppButton";

export type AppEmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function AppEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  children,
  className,
}: AppEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[1.8rem] border border-[#e7dfd6] bg-[#fbf8f4] p-6 text-center shadow-[0_14px_34px_rgba(52,38,25,0.05)] sm:p-8",
        className
      )}
    >
      {icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8d8] text-[#405028]">
          {icon}
        </div>
      ) : null}
      <h3 className="mx-auto max-w-[18ch] text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#171511]">
        {title}
      </h3>
      {description ? (
        <p className="mx-auto mt-3 max-w-[34rem] text-sm leading-6 text-[#675e55]">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="mt-5">
          <AppButton variant="secondary" onClick={onAction}>
            {actionLabel}
          </AppButton>
        </div>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
