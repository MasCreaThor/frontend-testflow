// Tipos para la autenticación y recuperación de contraseña
export interface AuthResponse {
    user: {
      _id: string;
      email: string;
      name: string;
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