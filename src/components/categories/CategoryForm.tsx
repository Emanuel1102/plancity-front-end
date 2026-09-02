import { useState, useEffect, type FormEvent } from "react";
import type { Category, CreateCategory, UpdateCategory } from "../../types/category.interface";
import { ErrorMessage } from "../common/ErrorMessage";

interface CategoryFormProps {
  initialCategory?: Category;
  onSubmit: (payload: CreateCategory | UpdateCategory) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
}

function buildInitialState(category?: Category): FormState {
  return {
    name: category?.name ?? "",
    description: category?.description ?? "",
  };
}

export function CategoryForm({ initialCategory, onSubmit }: CategoryFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialCategory));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(buildInitialState(initialCategory));
  }, [initialCategory]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const payload: CreateCategory | UpdateCategory = {
      name: form.name,
      description: form.description || undefined,
    };

    setSubmitting(true);

    try {
      await onSubmit(payload);
    } catch {
      setError("No se pudo guardar la categoría. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
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

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Guardando..." : initialCategory ? "Actualizar categoría" : "Crear categoría"}
      </button>
    </form>
  );
}