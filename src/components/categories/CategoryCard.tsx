import { Link } from "react-router-dom";
import type { Category } from "../../types/category.interface";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="block rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md"
    >
      <h3 className="font-semibold text-gray-900">{category.name}</h3>
      {category.description && (
        <p className="mt-1 text-sm text-gray-500">{category.description}</p>
      )}
    </Link>
  );
}