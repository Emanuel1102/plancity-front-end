import { Link } from "react-router-dom";
import type { Event } from "../../types/event.interface";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { FavoriteButton } from "./FavoriteButton";

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite?: (eventId: string, newState: boolean) => void;
}

export function EventCard({ event, isFavorite, onToggleFavorite }: EventCardProps) {
  const coverImage = event.images[0]?.url;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <Link to={`/events/${event.id}`}>
        {coverImage ? (
          <img src={coverImage} alt={event.name} className="h-48 w-full object-cover" />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-400">
            Sin imagen
          </div>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link to={`/events/${event.id}`}>
            <h3 className="font-semibold text-gray-900 hover:underline">{event.name}</h3>
          </Link>
          <FavoriteButton
            eventId={event.id}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />
        </div>

        <p className="mt-1 text-sm text-gray-500">{event.category.name}</p>
        <p className="mt-2 text-sm text-gray-600">{formatDate(event.date)}</p>
        <p className="text-sm text-gray-600">{event.location}</p>
        <p className="mt-2 font-medium text-gray-900">{formatPrice(event.price)}</p>
      </div>
    </div>
  );
}