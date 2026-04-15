import type {
  PlannerCompanion,
  PlannerMoment,
  PlannerSelections,
  PlannerVibe,
} from "./types";

type MomentPlannerSectionProps = {
  selections: PlannerSelections;
  onCompanionChange: (value: PlannerCompanion) => void;
  onMomentChange: (value: PlannerMoment) => void;
  onVibeChange: (value: PlannerVibe) => void;
  onHide: () => void;
};

const COMPANION_OPTIONS: Array<{ value: PlannerCompanion; label: string }> = [
  { value: "solo", label: "Solo" },
  { value: "date", label: "Date" },
  { value: "gezin", label: "Gezin" },
  { value: "vrienden", label: "Vrienden" },
];

const MOMENT_OPTIONS: Array<{ value: PlannerMoment; label: string }> = [
  { value: "nu", label: "Nu" },
  { value: "vanavond", label: "Vanavond" },
  { value: "morgen", label: "Morgen" },
  { value: "weekend", label: "Dit weekend" },
];

const VIBE_OPTIONS: Array<{ value: PlannerVibe; label: string }> = [
  { value: "cultureel", label: "Cultureel" },
  { value: "actief", label: "Actief" },
  { value: "eten-drinken", label: "Eten & drinken" },
  { value: "relaxed", label: "Relaxed" },
];

function ChoiceGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  selected: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a8072]">
        {label}
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-[#b8ea72] bg-[#c8ef8c] text-[#213119]"
                  : "border-[#ece2d7] bg-white text-[#4f483d] hover:border-[#ddcfbf] hover:bg-[#fcfaf6]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MomentPlannerSection({
  selections,
  onCompanionChange,
  onMomentChange,
  onVibeChange,
  onHide,
}: MomentPlannerSectionProps) {
  return (
    <section className="mt-8 rounded-[2.1rem] border border-black/6 bg-white/80 px-5 py-5 shadow-[0_18px_50px_rgba(49,36,21,0.05)] backdrop-blur sm:px-7 sm:py-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[36rem]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a8072]">
            Jouw moment
          </div>
          <p className="mt-2 text-sm leading-6 text-[#655b4f] sm:text-base">
            Kies een setting en we filteren de keuzes hieronder direct op sfeer,
            timing en wat het best past bij jullie plan.
          </p>
        </div>

        <button
          type="button"
          onClick={onHide}
          className="inline-flex self-start rounded-full border border-[#e7dbcf] bg-[#faf6f0] px-4 py-2 text-sm font-medium text-[#5f564a] transition hover:bg-white"
        >
          Verberg dit
        </button>
      </div>

      <div className="mt-6 grid gap-6">
        <ChoiceGroup
          label="Met wie ga je?"
          options={COMPANION_OPTIONS}
          selected={selections.companion}
          onChange={onCompanionChange}
        />

        <ChoiceGroup
          label="Wanneer wil je iets doen?"
          options={MOMENT_OPTIONS}
          selected={selections.moment}
          onChange={onMomentChange}
        />

        <ChoiceGroup
          label="Waar heb je zin in?"
          options={VIBE_OPTIONS}
          selected={selections.vibe}
          onChange={onVibeChange}
        />
      </div>
    </section>
  );
}
