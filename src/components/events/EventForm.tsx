import { useState, useEffect, type FormEvent } from "react";
import type { Category } from "../../types/category.interface";
import type { Event, CreateEvent, UpdateEvent } from "../../types/event.interface";
import { ErrorMessage } from "../common/ErrorMessage";

interface EventFormProps {
  categories: Category[];
  initialEvent?: Event;
  defaultCategoryId?: string;
  onSubmit: (payload: CreateEvent | UpdateEvent) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
  date: string;
  location: string;
  price: string;
  capacity: string;
  categoryId: string;
  images: string[];
}

function buildInitialState(event?: Event, defaultCategoryId?: string): FormState {
  if (event) {
    return {
      name: event.name,
      description: event.description,
      date: event.date.slice(0, 16), // formato compatible con <input type="datetime-local">
      location: event.location,
      price: String(event.price),
      capacity: String(event.capacity),
      categoryId: event.categoryId,
      images: event.images.map((img) => img.url),
    };
  }

  return {
    name: "",
    description: "",
    date: "",
    location: "",
    price: "",
    capacity: "",
    categoryId: defaultCategoryId ?? "",
    images: [],
  };
}

export function EventForm({ categories, initialEvent, defaultCategoryId, onSubmit }: EventFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialEvent, defaultCategoryId));
  const [imageInput, setImageInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(buildInitialState(initialEvent, defaultCategoryId));
  }, [initialEvent, defaultCategoryId]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.date || !form.location || !form.categoryId) {
      setError("Completa los campos obligatorios.");
      return;
    }

    const payload: CreateEvent | UpdateEvent = {
      name: form.name,
      description: form.description || undefined,
      date: new Date(form.date).toISOString(),
      location: form.location,
      price: Number(form.price) || 0,
      capacity: Number(form.capacity) || 0,
      categoryId: form.categoryId,
      images: form.images,
    };

    setSubmitting(true);

    try {
      await onSubmit(payload);
    } catch {
      setError("No se pudo guardar el evento. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      {error && <ErrorMessage message={error} />}

      <div>
        <label className="block text-sm font-medium">Nombre *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Fecha y hora *</label>
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Lugar *</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Precio</label>
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">Cupo</label>
          <input
            type="number"
            min={0}
            value={form.capacity}
            onChange={(e) => handleChange("capacity", e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Categoría *</label>
        <select
          value={form.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Imágenes (URL)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded border border-gray-300 px-3 py-2"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="rounded bg-gray-800 px-3 py-2 text-white"
          >
            Agregar
          </button>
        </div>

        <ul className="mt-2 flex flex-col gap-1">
          {form.images.map((url, index) => (
            <li key={index} className="flex items-center justify-between text-sm text-gray-600">
              <span className="truncate">{url}</span>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="ml-2 text-red-500 hover:underline"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Guardando..." : initialEvent ? "Actualizar evento" : "Crear evento"}
      </button>
    </form>
  );
}