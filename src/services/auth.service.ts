import { apiClient } from "@/services/api-client";
import { LoginRequest, AuthResponse } from "../types/auth";
import { ApiResponse } from "@/types/ApiResponse";

export const authService = {
  login: (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient<ApiResponse<AuthResponse>>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: (data: LoginRequest): Promise<ApiResponse<string>> => {
    return apiClient<ApiResponse<string>>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  refreshToken: (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    return apiClient<ApiResponse<AuthResponse>>("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};
