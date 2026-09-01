import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { EventDetailPage } from "../pages/EventDetailPage";
import { CategoryDetailPage } from "../pages/CategoryDetailPage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { EventFormPage } from "../pages/admin/EventFormPage";
import { CategoryFormPage } from "../pages/admin/CategoryFormPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { AdminRoute } from "../components/common/AdminRoute";

export const router = createBrowserRouter([
  // Públicas
  { path: "/", element: <HomePage /> },
  { path: "/events/:id", element: <EventDetailPage /> },
  { path: "/categories/:id", element: <CategoryDetailPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // Protegidas (requieren sesión)
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <FavoritesPage />
      </ProtectedRoute>
    ),
  },

  // Protegidas por rol admin
  {
    path: "/admin/events/new",
    element: (
      <AdminRoute>
        <EventFormPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/events/:id/edit",
    element: (
      <AdminRoute>
        <EventFormPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/categories/new",
    element: (
      <AdminRoute>
        <CategoryFormPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/categories/:id/edit",
    element: (
      <AdminRoute>
        <CategoryFormPage />
      </AdminRoute>
    ),
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);