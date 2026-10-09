"use-client";

import { AuthResponse, User } from "@/types/auth";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setSession: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const setSession = (data: AuthResponse) => {
    setUser(data.user);
    // Aquí invocarás tu guardar de tokens (ej. Cookies o LocalStorage)
  };

  const logout = () => {
    setUser(null);
    // Limpiar tokens y redirigir
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};