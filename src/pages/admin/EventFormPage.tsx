import { useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { eventService } from "../../services/event.service";
import { categoryService } from "../../services/category.service";
import { EventForm } from "../../components/events/EventForm";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import type { Event, CreateEvent, UpdateEvent } from "../../types/event.interface";

export function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const defaultCategoryId = searchParams.get("categoryId") ?? undefined;

  const fetchEvent = useCallback((): Promise<Event | null> => {
    if (!id) return Promise.resolve(null);
    return eventService.getById(id);
  }, [id]);

  const { data: event, loading: eventLoading, error: eventError } = useFetch(fetchEvent, [id]);

  const fetchCategories = useCallback(() => categoryService.getAll(), []);
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch(
    fetchCategories,
    []
  );

  const handleSubmit = async (payload: CreateEvent | UpdateEvent) => {
    if (isEditMode) {
      await eventService.update(id!, payload as UpdateEvent);
    } else {
      await eventService.create(payload as CreateEvent);
    }
    navigate("/");
  };

  if ((isEditMode && eventLoading) || categoriesLoading) return <Loader />;
  if (isEditMode && eventError) return <ErrorMessage message={eventError.message} />;
  if (categoriesError) return <ErrorMessage message={categoriesError.message} />;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {isEditMode ? "Editar evento" : "Nuevo evento"}
      </h1>

      <EventForm
        categories={categories ?? []}
        initialEvent={event ?? undefined}
        defaultCategoryId={defaultCategoryId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}