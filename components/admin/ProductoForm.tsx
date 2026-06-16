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
    },
  });

  const isLoading = isSubmitting || isPending;
  const watchCategory = watch("category");

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
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700 select-none">
            Destacar producto (se mostrará en la sección de destacados de la tienda)
          </label>
        </div>
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
