"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  photoUrls: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ photoUrls, onChange, disabled }: ImageUploaderProps) {
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
        const { error } = await supabase.storage
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
      } catch (err) {
        console.error("Error al subir archivo:", err);
        const errMsg = err instanceof Error ? err.message : String(err);
        toast.error(`Error al subir ${file.name}: ${errMsg}`);
      }
    }

    if (newUrls.length > 0) {
      onChange([...photoUrls, ...newUrls]);
      toast.success(`${newUrls.length} imagen(es) subida(s) con éxito.`);
    }
    setUploading(false);
    e.target.value = "";
  };

  const removePhoto = (url: string) => {
    onChange(photoUrls.filter((u) => u !== url));
  };

  const isLoading = disabled || uploading;

  return (
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
  );
}
