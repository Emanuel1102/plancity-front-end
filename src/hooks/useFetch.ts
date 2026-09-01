import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export type FetchErrorType = "network" | "validation" | "auth" | "unknown";

export interface FetchError {
  type: FetchErrorType;
  message: string;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: FetchError | null;
  refetch: () => void;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  const execute = useCallback(() => {
    let isActive = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        if (isActive) setData(result);
      } catch (err) {
        if (!isActive) return;

        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setError({ type: "network", message: "Error de conexión con el servidor." });
          } else if (err.response.status === 400) {
            setError({ type: "validation", message: "Datos inválidos." });
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError({ type: "auth", message: "No tienes permisos para esto." });
          } else {
            setError({ type: "unknown", message: "Ocurrió un error inesperado." });
          }
        } else {
          setError({ type: "unknown", message: "Ocurrió un error inesperado." });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cleanup = execute();
    return cleanup;
  }, [execute]);

  return { data, loading, error, refetch: execute };
}