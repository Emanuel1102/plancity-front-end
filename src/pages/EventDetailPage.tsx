import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { eventService } from "../services/event.service";
import { favoriteService } from "../services/favorite.service";
import { FavoriteButton } from "../components/events/FavoriteButton";
import { Loader } from "../components/common/Loader";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { formatDate } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);

  const fetchEvent = useCallback(() => eventService.getById(id!), [id]);
  const { data: event, loading, error } = useFetch(fetchEvent, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) {
      setIsFavorite(false);
      return;
    }

    favoriteService
      .getAll()
      .then((favorites) => setIsFavorite(favorites.some((f) => f.id === id)))
      .catch(() => setIsFavorite(false));
  }, [isAuthenticated, id]);

  const handleToggleFavorite = (_eventId: string, newState: boolean) => {
    setIsFavorite(newState);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!event) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {event.images.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-2">
          {event.images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={event.name}
              className="h-64 w-full rounded object-cover"
            />
          ))}
        </div>
      )}

      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
        <FavoriteButton
          eventId={event.id}
          isFavorite={isFavorite}
          onToggle={handleToggleFavorite}
        />
      </div>

      <p className="mt-1 text-sm font-medium text-blue-600">{event.category.name}</p>

      <p className="mt-4 text-gray-700">{event.description}</p>

      <div className="mt-6 flex flex-col gap-2 text-gray-800">
        <p>
          <span className="font-semibold">Fecha:</span> {formatDate(event.date)}
        </p>
        <p>
          <span className="font-semibold">Lugar:</span> {event.location}
        </p>
        <p>
          <span className="font-semibold">Precio:</span> {formatPrice(event.price)}
        </p>
        <p>
          <span className="font-semibold">Cupo:</span> {event.capacity} personas
        </p>
      </div>
    </div>
  );
}