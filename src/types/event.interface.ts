import type { Category } from "./category.interface";

export interface EventImage {
  id: string;
  url: string;
  order: number;
  eventId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  category: Category;
  categoryId: string;
  images: EventImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvent {
  name: string;
  description?: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  images?: string[];
}

export interface UpdateEvent {
  name?: string;
  description?: string;
  date?: string;
  location?: string;
  price?: number;
  capacity?: number;
  categoryId?: string;
  images?: string[];
}