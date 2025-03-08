// Tipos para la autenticación y recuperación de contraseña
export interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface SetNewPasswordRequest {
  token: string;
  newPassword: string;
}

export interface SetNewPasswordResponse {
  message: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
