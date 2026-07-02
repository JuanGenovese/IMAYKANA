import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  nombre: z.string().min(2, "Nombre requerido (mínimo 2 caracteres)"),
  apellido: z.string().min(2, "Apellido requerido (mínimo 2 caracteres)"),
  nDni: z.string()
    .min(6, "DNI requerido (mínimo 6 caracteres)")
    .regex(/^\d+$/, "El DNI debe contener solo números"),
  isVendedor: z.boolean().default(false),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export const resetSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
});

export interface AuthFormValues {
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
  nDni?: string;
  isVendedor?: boolean;
}
