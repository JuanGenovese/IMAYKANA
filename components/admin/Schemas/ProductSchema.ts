import z from "zod";
import { ProductoConRelaciones } from "@/lib/db/schema/queries/Interface";

export const productoSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    category: z.string().min(1, "La categoría es obligatoria"),
    size: z.string().min(1, "El talle es obligatorio"),
    color: z.string().min(1, "El color es obligatorio"),
    descriptionSummary: z.string(),
    specificMeasurements: z.string(),
    status: z.enum(["Disponible", "Reservado", "Vendido"]),
});

export type ProductoValues = z.infer<typeof productoSchema>;

export interface ProductoFormProps {
    producto?: ProductoConRelaciones;
}