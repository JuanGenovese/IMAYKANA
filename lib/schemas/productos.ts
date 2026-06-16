import { z } from "zod";
import { type ProductoConRelaciones } from "@/lib/db/schema";

export const productoFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  category: z.string().min(1, "La categoría es obligatoria"),
  size: z.string().min(1, "El talle es obligatorio"),
  color: z.string().min(1, "El color es obligatorio"),
  descriptionSummary: z.string(),
  specificMeasurements: z.string().regex(/\d+\s*cm/i, "Debe especificar al menos una medida en 'cm' (ej: '70cm' o 'Largo 70cm')"),
  status: z.string().min(1, "El estado es obligatorio"),
  featured: z.boolean(),
});

export const productoSchema = productoFormSchema.extend({
  photoUrls: z.array(z.string().url()).default([]),
});

export type ProductoFormValues = z.infer<typeof productoFormSchema>;
export type ProductoValues = z.infer<typeof productoSchema>;

export interface ProductoFormProps {
  producto?: ProductoConRelaciones;
}
