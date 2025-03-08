// src/types/auth.types.ts
// Tipos para la autenticación y recuperación de contraseña
export interface AuthResponse {
  user: {
    _id: string;
    email: string;
  };
  accessToken: string;
  refreshToken?: string;
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

// Nuevos tipos para manejar la información de perfil de usuario
export interface UserProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  studyGoals?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyGoal {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  studyGoals?: string[];
}