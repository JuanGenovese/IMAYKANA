import { z } from "zod";

export const productoSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    category: z.string().min(1, "La categoría es obligatoria"),
    size: z.string().min(1, "El talle es obligatorio"),
    color: z.string().min(1, "El color es obligatorio"),
    descriptionSummary: z.string().default(""),
    specificMeasurements: z.string().default(""),
    status: z.enum(["Disponible", "Reservado", "Vendido"]).default("Disponible"),
    photoUrls: z.array(z.string().url()).default([]),
});