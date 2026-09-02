import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">
      <Link to="/" className="text-lg font-bold">
        PlanCity
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Link to="/favorites" className="hover:underline">
            Mis eventos favoritos
          </Link>
        )}
        
        <Link to="/" className="hover:underline">
          Eventos
        </Link>


        {isAuthenticated && (
          <Link to="/categories" className="hover:underline">
            Categorías
          </Link>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin/events/new" className="hover:underline">
              Nuevo evento
            </Link>
            <Link to="/admin/categories/new" className="hover:underline">
              Nueva categoría
            </Link>
          </>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:underline">
              Iniciar sesión
            </Link>
            <Link to="/register" className="hover:underline">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}