import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600">La página que buscas no existe.</p>
      <Link to="/" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Volver al inicio
      </Link>
    </div>
  );
}