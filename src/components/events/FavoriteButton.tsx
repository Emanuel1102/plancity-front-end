import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { favoriteService } from "../../services/favorite.service";

interface FavoriteButtonProps {
  eventId: string;
  isFavorite: boolean;
  onToggle?: (eventId: string, newState: boolean) => void;
}

export function FavoriteButton({ eventId, isFavorite, onToggle }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        await favoriteService.remove(eventId);
        onToggle?.(eventId, false);
      } else {
        await favoriteService.add(eventId);
        onToggle?.(eventId, true);
      }
    } catch (err) {
      // 409 (ya era favorito) o 404 (no lo era): el estado ya está desincronizado,
      // igual reflejamos el estado "contrario" al que intentábamos para no romper la UI.
      onToggle?.(eventId, !isFavorite);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`rounded-full p-2 text-xl transition ${
        isFavorite ? "text-red-500" : "text-gray-400"
      } hover:scale-110 disabled:opacity-50`}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}