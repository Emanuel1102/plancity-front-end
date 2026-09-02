import type { Category } from "../../types/category.interface";

interface EventFiltersProps {
  search: string;
  categoryId: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function EventFilters({
  search,
  categoryId,
  categories,
  onSearchChange,
  onCategoryChange,
}: EventFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        placeholder="Buscar eventos..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 rounded border border-gray-300 px-3 py-2"
      />

      <select
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded border border-gray-300 px-3 py-2"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}