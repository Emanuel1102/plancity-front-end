import { useCallback, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { favoriteService } from "../services/favorite.service";
import { EventList } from "../components/events/EventList";
import { Loader } from "../components/common/Loader";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function FavoritesPage() {
  const fetchFavorites = useCallback(() => favoriteService.getAll(), []);
  const { data: favorites, loading, error, refetch } = useFetch(fetchFavorites, []);

  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleToggleFavorite = (eventId: string, newState: boolean) => {
    if (!newState) {
      // Se quitó de favoritos: lo ocultamos localmente sin esperar a un refetch completo.
      setRemovedIds((prev) => new Set(prev).add(eventId));
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const visibleFavorites = (favorites ?? []).filter((event) => !removedIds.has(event.id));
  const favoriteIds = new Set(visibleFavorites.map((event) => event.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis favoritos</h1>
        <button
          onClick={refetch}
          className="rounded bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"
        >
          Actualizar
        </button>
      </div>

      <EventList
        events={visibleFavorites}
        favoriteIds={favoriteIds}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}