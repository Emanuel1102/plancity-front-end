import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { categoryService } from "../../services/category.service";
import { CategoryForm } from "../../components/categories/CategoryForm";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import type { Category, CreateCategory, UpdateCategory } from "../../types/category.interface";

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const fetchCategory = useCallback((): Promise<Category | null> => {
    if (!id) return Promise.resolve(null);
    return categoryService.getById(id);
  }, [id]);

  const { data: category, loading, error } = useFetch(fetchCategory, [id]);

  const handleSubmit = async (payload: CreateCategory | UpdateCategory) => {
    if (isEditMode) {
      await categoryService.update(id!, payload as UpdateCategory);
    } else {
      await categoryService.create(payload as CreateCategory);
    }
    navigate("/");
  };

  if (isEditMode && loading) return <Loader />;
  if (isEditMode && error) return <ErrorMessage message={error.message} />;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {isEditMode ? "Editar categoría" : "Nueva categoría"}
      </h1>

      <CategoryForm initialCategory={category ?? undefined} onSubmit={handleSubmit} />
    </div>
  );
}