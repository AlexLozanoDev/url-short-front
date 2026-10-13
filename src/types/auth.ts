export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string,
  email: string
}
