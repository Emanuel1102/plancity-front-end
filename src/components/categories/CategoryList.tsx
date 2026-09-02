import type { Category } from "../../types/category.interface";
import { CategoryCard } from "./CategoryCard";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories?.length < 1) {
    return <p className="text-center text-gray-500">No hay categorías para mostrar.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}