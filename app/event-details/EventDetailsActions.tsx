import CalendarActions from "@/components/calendar/CalendarActions";
import ShareAction from "@/components/ShareAction";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { CalendarEventInput } from "@/lib/calendarIntegration";

type EventDetailsActionsProps = {
  calendar: CalendarEventInput;
  title: string;
};

export function EventDetailsActions({
  calendar,
  title,
}: EventDetailsActionsProps) {
  const { t } = useLocale();

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <CalendarActions event={calendar} />
      <ShareAction
        title={title}
        text={t("events.shareText", { title })}
        url={calendar.url || "/event-details"}
      />
    </div>
  );
}
