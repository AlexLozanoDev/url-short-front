"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LoginRequest, AuthResponse } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginRequest) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const data = await response.json();
    setUser(data.user);
    router.push("/dashboard");
    router.refresh();
  };

  const register = async (dataPayload: LoginRequest) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrarse");
    }

    router.push("/auth/login");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
