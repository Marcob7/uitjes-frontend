import { Suspense } from "react";
import EventsClient from "./EventsClient";

export default function EventsPage() {
  return (
    <Suspense fallback={<p className="px-4 py-6 text-sm text-[#6d6458]">Laden...</p>}>
      <EventsClient />
    </Suspense>
  );
}
