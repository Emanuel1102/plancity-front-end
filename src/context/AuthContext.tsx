import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user.interface";
import type { LoginPayload, RegisterPayload } from "../types/auth.interface";
import { authService } from "../services/auth.service";
import { tokenStorage } from "../services/tokenStorage";

interface AuthContextValue {
  user: User | null;
  role: User["role"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenStorage.getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        tokenStorage.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { accessToken, user: loggedUser } = await authService.login(payload);
    tokenStorage.setToken(accessToken);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { accessToken, user: registeredUser } = await authService.register(payload);
    tokenStorage.setToken(accessToken);
    setUser(registeredUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      tokenStorage.removeToken();
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}