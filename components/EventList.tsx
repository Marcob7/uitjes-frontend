// frontend/components/EventList.tsx
import EventCard from "@/components/EventCard";

export default function EventList({ events }: { events: any }) {
  const list = Array.isArray(events) ? events : [];

  if (!Array.isArray(events)) {
    console.log("EventList verwacht array, kreeg:", events);
  }

  return (
    <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0 }}>
      {list.map((e: any) => (
        <EventCard key={e.id ?? e.pk ?? JSON.stringify(e)} event={e} />
      ))}
    </ul>
  );
}