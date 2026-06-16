"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { crearProducto, actualizarProducto } from "@/actions/productos";
import { type ProductoFormValues, productoFormSchema, type ProductoFormProps } from "@/lib/schemas/productos";
import { Field, inputCls } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function ProductoForm({ producto }: ProductoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    producto?.imagenes?.map((img) => img.url) ?? [],
  );

  const {
    register,
    handleSubmit,
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
      status: (producto?.estado?.estado as ProductoFormValues["status"]) ?? "Disponible",
    },
  });

  const isLoading = isSubmitting || isPending;

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
        router.push("/dashboard/productos");
        router.refresh();
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
            <option value="Disponible">Disponible</option>
            <option value="Reservado">Reservado</option>
            <option value="Vendido">Vendido</option>
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
