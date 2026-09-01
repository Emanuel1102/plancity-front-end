import { api } from "./api";
import type { Event, CreateEvent, UpdateEvent } from "../types/event.interface";

export interface EventFilters {
  search?: string;
  categoryId?: string;
}

export const eventService = {
  async getAll(filters?: EventFilters): Promise<Event[]> {
    const { data } = await api.get<Event[]>("/events", { params: filters });
    return data;
  },

  async getById(id: string): Promise<Event> {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  async create(payload: CreateEvent): Promise<Event> {
    const { data } = await api.post<Event>("/events", payload);
    return data;
  },

  async update(id: string, payload: UpdateEvent): Promise<Event> {
    const { data } = await api.patch<Event>(`/events/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};