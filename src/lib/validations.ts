// src/lib/validations.ts
import { z } from 'zod';

// Esquemas de validadciones
export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Ingresa un correo electrónico válido' })
});


export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .max(50, { message: 'La contraseña no puede exceder los 50 caracteres' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'La confirmación de contraseña es requerida' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});


export type ResetPasswordRequestFormValues = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;