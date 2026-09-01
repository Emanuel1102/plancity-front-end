import { api } from "./api";
import type { Event } from "../types/event.interface";

export const favoriteService = {
  async getAll(): Promise<Event[]> {
    const { data } = await api.get<Event[]>("/favorites");
    return data;
  },

  async add(eventId: string): Promise<Event> {
    const { data } = await api.post<Event>(`/favorites/${eventId}`);
    return data;
  },

  async remove(eventId: string): Promise<void> {
    await api.delete(`/favorites/${eventId}`);
  },
};