import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { categoryService } from "../services/category.service";
import { eventService } from "../services/event.service";
import { favoriteService } from "../services/favorite.service";
import { EventList } from "../components/events/EventList";
import { Loader } from "../components/common/Loader";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const fetchCategory = useCallback(() => categoryService.getById(id!), [id]);
  const { data: category, loading: categoryLoading, error: categoryError } = useFetch(
    fetchCategory,
    [id]
  );

  const fetchEvents = useCallback(() => eventService.getAll({ categoryId: id }), [id]);
  const { data: events, loading: eventsLoading, error: eventsError } = useFetch(fetchEvents, [id]);

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

  const handleDeleteCategory = async () => {
    if (!id || !window.confirm("¿Eliminar esta categoría?")) return;

    try {
      await categoryService.remove(id);
      navigate("/");
    } catch {
      window.alert("No se pudo eliminar la categoría.");
    }
  };

  if (categoryLoading) return <Loader />;
  if (categoryError) return <ErrorMessage message={categoryError.message} />;
  if (!category) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="mt-1 text-gray-600">{category.description}</p>
          )}
        </div>

        {role === "admin" && (
          <div className="flex gap-2">
            <Link
              to={`/admin/categories/${category.id}/edit`}
              className="rounded bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-900"
            >
              Editar
            </Link>
            <button
              onClick={handleDeleteCategory}
              className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
            >
              Eliminar
            </button>
            <Link
              to={`/admin/events/new?categoryId=${category.id}`}
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              Nuevo evento
            </Link>
          </div>
        )}
      </div>

      {eventsLoading && <Loader />}
      {eventsError && <ErrorMessage message={eventsError.message} />}

      {!eventsLoading && !eventsError && events && (
        <EventList events={events} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} />
      )}
    </div>
  );
}