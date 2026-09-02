import type { Event } from "../../types/event.interface";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: Event[];
  favoriteIds: Set<string>;
  onToggleFavorite: (eventId: string, newState: boolean) => void;
}

export function EventList({ events, favoriteIds, onToggleFavorite }: EventListProps) {
  if (events.length === 0) {
    return <p className="text-center text-gray-500">No hay eventos para mostrar.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isFavorite={favoriteIds.has(event.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}