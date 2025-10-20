export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface TokenResponse {
  message: string;
  token: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
}

export interface ApiError {
  message: string;
  error?: string;
}
