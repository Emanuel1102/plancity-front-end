import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { eventService } from "../services/event.service";
import { categoryService } from "../services/category.service";
import { favoriteService } from "../services/favorite.service";
import { EventList } from "../components/events/EventList";
import { EventFilters } from "../components/events/EventFilters";
import { Loader } from "../components/common/Loader";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function HomePage() {
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const fetchEvents = useCallback(
    () => eventService.getAll({ search: search || undefined, categoryId: categoryId || undefined }),
    [search, categoryId]
  );

  const { data: events, loading: eventsLoading, error: eventsError } = useFetch(fetchEvents, [
    search,
    categoryId,
  ]);

  const fetchCategories = useCallback(() => categoryService.getAll(), []);
  const { data: categories } = useFetch(fetchCategories, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }

    favoriteService
      .getAll()
      .then((favorites) => setFavoriteIds(new Set(favorites.map((f) => f.id))))
      .catch(() => setFavoriteIds(new Set()));
  }, [isAuthenticated]);

  const handleToggleFavorite = (eventId: string, newState: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (newState) {
        next.add(eventId);
      } else {
        next.delete(eventId);
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Eventos</h1>

      <EventFilters
        search={search}
        categoryId={categoryId}
        categories={categories ?? []}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryId}
      />

      {eventsLoading && <Loader />}
      {eventsError && <ErrorMessage message={eventsError.message} />}

      {!eventsLoading && !eventsError && events && (
        <EventList events={events} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} />
      )}
    </div>
  );
}