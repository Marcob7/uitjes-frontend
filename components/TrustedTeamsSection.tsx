import React from "react";

type TrustedTeamItem = {
  id: string;
  name: string;
  logoText: string;
};

type TrustedTeamsSectionProps = {
  eyebrow?: string;
  items?: TrustedTeamItem[];
};

const defaultItems: TrustedTeamItem[] = [
  { id: "1", name: "Accenture", logoText: "accenture" },
  { id: "2", name: "Snapple", logoText: "snapple" },
  { id: "3", name: "UM", logoText: "UM" },
  { id: "4", name: "Nova", logoText: "nova" },
  { id: "5", name: "Pixel", logoText: "pixel" },
];

export default function TrustedTeamsSection({
  eyebrow = "Trusted by world-class teams at:",
  items = defaultItems,
}: TrustedTeamsSectionProps) {
  return (
    <section className="w-full bg-[#f4f4f3] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-10">
        <div className="mb-8 sm:mb-10">
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#7a3428]">
            {eyebrow}
          </p>
        </div>

        <div className="overflow-hidden">
          <div className="flex gap-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex h-[192px] min-w-[290px] items-center justify-center rounded-[16px] bg-[#eee8e3] px-8"
              >
                <div className="flex items-center justify-center text-center">
                  <span className="text-[34px] font-semibold tracking-[-0.04em] text-[#7a3428] sm:text-[38px]">
                    {item.logoText}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-5">
          <button
            type="button"
            aria-label="Vorige"
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border border-[#d8d0c9] bg-transparent text-[#2e241f] transition hover:bg-[#ebe5df]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14.5 6.5L9 12L14.5 17.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Volgende"
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border border-[#d8d0c9] bg-transparent text-[#2e241f] transition hover:bg-[#ebe5df]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9.5 6.5L15 12L9.5 17.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}