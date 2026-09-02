import { useCallback } from "react"
import { categoryService } from "../services/category.service"
import { useFetch } from "../hooks/useFetch";
import { CategoryList } from "../components/categories/CategoryList";

export const CategoryPage = () => {

      const fetchCategories = useCallback(() => categoryService.getAll(), []);
      const { data: categories } = useFetch(fetchCategories, []);

      console.log(categories)

  return (
    <div>

      <h1>Categorias</h1>

      {categories?.length && <CategoryList categories={categories}/>}

    </div>
  )
}
