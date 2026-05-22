"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { crearProducto, actualizarProducto } from "@/actions/admin/productos";
import type { ProductoConRelaciones } from "@/lib/db/schema";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/client";

const productoSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  category: z.string().min(1, "La categoría es obligatoria"),
  size: z.string().min(1, "El talle es obligatorio"),
  color: z.string().min(1, "El color es obligatorio"),
  descriptionSummary: z.string(),
  specificMeasurements: z.string(),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]),
});

type ProductoValues = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  producto?: ProductoConRelaciones;
}

export function ProductoForm({ producto }: ProductoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    producto?.imagenes?.map((img) => img.url) ?? [],
  );
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);
    const supabase = createSupabaseClient();
    const newUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      try {
        const { data, error } = await supabase.storage
          .from("imagenes")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("imagenes")
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      } catch (err: any) {
        console.error("Error al subir archivo:", err);
        toast.error(`Error al subir ${file.name}: ${err.message || err}`);
      }
    }

    if (newUrls.length > 0) {
      setPhotoUrls((prev) => [...prev, ...newUrls]);
      toast.success(`${newUrls.length} imagen(es) subida(s) con éxito.`);
    }
    setUploading(false);
    e.target.value = "";
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductoValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      name: producto?.nombre ?? "",
      category: producto?.talleXCategoria?.categoria?.categoria ?? "",
      size: producto?.talleXCategoria?.talle?.talle ?? "",
      color: producto?.color ?? "",
      descriptionSummary: producto?.descripcion ?? "",
      specificMeasurements: producto?.medidasEspecificas ?? "",
      status: (producto?.estado?.estado as ProductoValues["status"]) ?? "AVAILABLE",
    },
  });

  const isLoading = isSubmitting || isPending || uploading;

  const onSubmit = (data: ProductoValues) => {
    startTransition(async () => {
      const payload = { ...data, photoUrls };
      const result = producto
        ? await actualizarProducto(producto.id, payload)
        : await crearProducto(payload);

      if (result?.error) {
        toast.error("Hay errores en el formulario. Revisalos.");
      } else {
        toast.success(
          producto ? "Producto actualizado." : "Producto creado con éxito.",
        );
        router.push("/dashboard/productos");
        router.refresh();
      }
    });
  };

  const removePhoto = (url: string) =>
    setPhotoUrls((prev) => prev.filter((u) => u !== url));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Campos de texto */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={errors.name?.message}>
          <input
            {...register("name")}
            disabled={isLoading}
            placeholder="Campera de cuero"
            className={inputCls}
          />
        </Field>
        <Field label="Categoría" error={errors.category?.message}>
          <input
            {...register("category")}
            disabled={isLoading}
            placeholder="Camperas"
            className={inputCls}
          />
        </Field>
        <Field label="Talle" error={errors.size?.message}>
          <input
            {...register("size")}
            disabled={isLoading}
            placeholder="M"
            className={inputCls}
          />
        </Field>
        <Field label="Color" error={errors.color?.message}>
          <input
            {...register("color")}
            disabled={isLoading}
            placeholder="Negro"
            className={inputCls}
          />
        </Field>
        <Field
          label="Medidas específicas"
          error={errors.specificMeasurements?.message}
        >
          <input
            {...register("specificMeasurements")}
            disabled={isLoading}
            placeholder="Largo 70cm, busto 90cm"
            className={inputCls}
          />
        </Field>
        <Field label="Estado" error={errors.status?.message}>
          <select
            {...register("status")}
            disabled={isLoading}
            className={inputCls}
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="RESERVED">Reservado</option>
            <option value="SOLD">Vendido</option>
          </select>
        </Field>
      </div>

      <Field label="Descripción" error={errors.descriptionSummary?.message}>
        <textarea
          {...register("descriptionSummary")}
          disabled={isLoading}
          rows={3}
          placeholder="Descripción del producto..."
          className={inputCls + " resize-none"}
        />
      </Field>

      {/* Upload de imágenes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Imágenes</label>
        {photoUrls.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {photoUrls.map((url) => (
              <div
                key={url}
                className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200"
              >
                <Image src={url} alt="preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl h-32 px-4 cursor-pointer hover:bg-gray-50 transition-colors border-gray-300">
          <span className="flex flex-col items-center gap-1">
            <Upload className={`mx-auto h-8 w-8 text-gray-400 ${uploading ? "animate-bounce text-gray-900" : ""}`} />
            <span className="text-sm font-medium text-gray-600">
              {uploading ? "Subiendo..." : "Subir imágenes"}
            </span>
            <span className="text-xs text-gray-400">
              Soporta múltiples archivos PNG, JPG, WEBP
            </span>
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60 transition"
        >
          {isLoading
            ? "Guardando..."
            : producto
              ? "Actualizar"
              : "Crear Producto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// Helpers
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputCls =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50 w-full";
