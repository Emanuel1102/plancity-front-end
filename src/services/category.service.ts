import { api } from "./api";
import type { Category, CreateCategory, UpdateCategory } from "../types/category.interface";

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  async create(payload: CreateCategory): Promise<Category> {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },

  async update(id: string, payload: UpdateCategory): Promise<Category> {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};