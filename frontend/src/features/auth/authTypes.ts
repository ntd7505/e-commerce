export interface Role {
  id?: number;
  name: string;
  description?: string;
  permissions?: unknown[];
}

export interface User {
  id?: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  status: string;
  roles: Role[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}
