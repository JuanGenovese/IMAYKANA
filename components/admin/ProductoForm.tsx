"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { crearProducto, actualizarProducto } from "@/actions/productos";
import { type ProductoFormValues, productoFormSchema } from "@/lib/schemas/productos";
import { Field, inputCls } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { cn } from "@/lib/utils";
import { type ProductoConRelaciones } from "@/lib/db/schema";

export interface FormMetadata {
  categories: string[];
  statuses: string[];
  categorySizes: Array<{ category: string; size: string }>;
}

export interface ProductoFormProps {
  producto?: ProductoConRelaciones;
  metadata: FormMetadata;
  onClose?: () => void;
}

export function ProductoForm({ producto, metadata, onClose }: ProductoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    producto?.imagenes?.map((img) => img.url) ?? [],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoFormSchema),
    defaultValues: {
      name: producto?.nombre ?? "",
      category: producto?.talleXCategoria?.categoria?.categoria ?? "",
      size: producto?.talleXCategoria?.talle?.talle ?? "",
      color: producto?.color ?? "",
      descriptionSummary: producto?.descripcion ?? "",
      specificMeasurements: producto?.medidasEspecificas ?? "",
      status: producto?.estado?.estado ?? "Disponible",
      featured: producto?.destacado ?? false,
      featuredPos: producto?.destacadoPos ? String(producto.destacadoPos) : "",
    },
  });

  const isLoading = isSubmitting || isPending;
  const watchCategory = watch("category");
  const watchFeatured = watch("featured");
  const watchFeaturedPos = watch("featuredPos");

  // Resetear el talle si deja de estar en la categoría elegida
  useEffect(() => {
    if (watchCategory) {
      const isValid = metadata.categorySizes.some(
        (cs) => cs.category === watchCategory && cs.size === getValues("size")
      );
      if (!isValid) {
        setValue("size", "");
      }
    }
  }, [watchCategory, setValue, getValues, metadata.categorySizes]);

  const availableSizes = metadata.categorySizes
    .filter((cs) => cs.category === watchCategory)
    .map((cs) => cs.size);

  const onSubmit = (data: ProductoFormValues) => {
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
        router.refresh();
        onClose?.();
      }
    });
  };

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
          <select
            {...register("category")}
            disabled={isLoading}
            className={inputCls}
          >
            <option value="">Seleccionar categoría</option>
            {metadata.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Talle" error={errors.size?.message}>
          <select
            {...register("size")}
            disabled={isLoading || !watchCategory}
            className={inputCls}
          >
            <option value="">
              {!watchCategory ? "Selecciona primero una categoría" : "Seleccionar talle"}
            </option>
            {availableSizes.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
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
            <option value="">Seleccionar estado</option>
            {metadata.statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-center gap-2 sm:col-span-2 pt-2">
          <input
            type="checkbox"
            id="featured"
            {...register("featured")}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700 select-none">
            Destacar producto (se mostrará en el Bento Grid de la tienda)
          </label>
        </div>

        {watchFeatured && (
          <div className="sm:col-span-2 border border-gray-200 rounded-2xl p-4 bg-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-200">
            <div className="flex-1 w-full">
              <Field label="Posición en el Bento Grid" error={errors.featuredPos?.message}>
                <select
                  {...register("featuredPos")}
                  disabled={isLoading}
                  className={inputCls}
                >
                  <option value="">Seleccionar posición...</option>
                  <option value="1">1 - Principal Grande (Columna 1)</option>
                  <option value="2">2 - Superior Apilado (Columna 2 - Fila 1)</option>
                  <option value="3">3 - Medio Apilado (Columna 2 - Fila 2)</option>
                  <option value="4">4 - Inferior Apilado (Columna 2 - Fila 3)</option>
                  <option value="5">5 - Lateral Destacado (Columna 3)</option>
                </select>
              </Field>
            </div>
            
            {/* Visual Bento Grid Preview Skeleton */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 w-full md:w-auto">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Ubicación en Bento Grid
              </span>
              <div className="w-40 h-28 grid grid-cols-4 gap-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-inner">
                {/* Slot 1: Principal grande (Columna 1) */}
                <div 
                  className={cn(
                    "col-span-2 row-span-3 rounded-md border transition-all duration-300 flex items-center justify-center text-[10px] font-bold",
                    watchFeaturedPos === "1" 
                      ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]" 
                      : "bg-gray-100 border-gray-200 text-gray-400"
                  )}
                >
                  1
                </div>
                
                {/* Column 2 (middle 3 stacked slots) */}
                <div className="col-span-1 flex flex-col gap-1">
                  <div 
                    className={cn(
                      "flex-1 rounded-md border transition-all duration-300 flex items-center justify-center text-[8px] font-bold",
                      watchFeaturedPos === "2" 
                        ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.03]" 
                        : "bg-gray-100 border-gray-200 text-gray-400"
                    )}
                  >
                    2
                  </div>
                  <div 
                    className={cn(
                      "flex-1 rounded-md border transition-all duration-300 flex items-center justify-center text-[8px] font-bold",
                      watchFeaturedPos === "3" 
                        ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.03]" 
                        : "bg-gray-100 border-gray-200 text-gray-400"
                    )}
                  >
                    3
                  </div>
                  <div 
                    className={cn(
                      "flex-1 rounded-md border transition-all duration-300 flex items-center justify-center text-[8px] font-bold",
                      watchFeaturedPos === "4" 
                        ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.03]" 
                        : "bg-gray-100 border-gray-200 text-gray-400"
                    )}
                  >
                    4
                  </div>
                </div>

                {/* Slot 5: Lateral (Columna 3) */}
                <div 
                  className={cn(
                    "col-span-1 row-span-3 rounded-md border transition-all duration-300 flex items-center justify-center text-[10px] font-bold",
                    watchFeaturedPos === "5" 
                      ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]" 
                      : "bg-gray-100 border-gray-200 text-gray-400"
                  )}
                >
                  5
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Field label="Descripción" error={errors.descriptionSummary?.message}>
        <textarea
          {...register("descriptionSummary")}
          disabled={isLoading}
          rows={3}
          placeholder="Descripción del producto..."
          className={cn(inputCls, "resize-none")}
        />
      </Field>

      {/* Upload de imágenes */}
      <ImageUploader
        photoUrls={photoUrls}
        onChange={setPhotoUrls}
        disabled={isLoading}
      />

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition shadow-sm"
        >
          {isLoading
            ? "Guardando..."
            : producto
              ? "Actualizar"
              : "Crear Producto"}
        </button>
        <button
          type="button"
          onClick={() => (onClose ? onClose() : router.back())}
          disabled={isLoading}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
