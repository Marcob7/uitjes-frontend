"use client";

import CitySelect from "@/components/CitySelect";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localePathname } from "@/lib/i18n/config";
import { cityOptions } from "@/lib/cityConfig";

import {
  FullscreenChoiceFlow,
  FullscreenChoiceQuestion,
} from "./FullscreenChoiceFlow";
import { InspirationFlowScenery } from "../inspiration/InspirationFlowScenery";

const cityChoiceSteps = [{ id: "city", type: "custom" as const }];

/**
 * The city-less /ontdek entry point. This intentionally has no persisted
 * selection: choosing a city starts the existing discover planner at its
 * companion question through the normal city URL.
 */
export default function DiscoverCityChoiceFlow() {
  const { locale, t } = useLocale();

  return (
    <FullscreenChoiceFlow
      steps={cityChoiceSteps}
      currentStep={1}
      onStepChange={() => undefined}
      onComplete={() => undefined}
      exitHref={localePathname("/", locale)}
      exitLabel={t("discover.backHome")}
      showProgress={() => false}
      showFooter={() => false}
      decorativeLayer={() => <InspirationFlowScenery variant="default" />}
    >
      {() => (
        <FullscreenChoiceQuestion
          title={t("discover.cityQuestion")}
          description={t("discover.citySelectionDescription")}
          introNote={t("discover.citySelectionIntro")}
        >
          <div className="w-full max-w-2xl rounded-[1.4rem] border border-[#DCE1DC] bg-white/[0.96] p-4 shadow-[0_14px_30px_rgba(41,52,47,0.06)] sm:p-5">
            <CitySelect
              cities={cityOptions}
              baseUrl={localePathname("/ontdek", locale)}
              label={t("discover.cityQuestion")}
              placeholder={t("discover.chooseCity")}
            />
          </div>
        </FullscreenChoiceQuestion>
      )}
    </FullscreenChoiceFlow>
  );
}
