import { apiClient } from "@/services/api-client";
import { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

export const authService = {
  login: (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient<AuthResponse>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: (data: RegisterRequest): Promise<string> => {
    return apiClient<string>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  refreshToken: (refreshToken: string): Promise<AuthResponse> => {
    return apiClient<AuthResponse>("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};
