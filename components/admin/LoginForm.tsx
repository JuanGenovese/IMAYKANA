"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error("Credenciales incorrectas o error de acceso.");
        console.error(error);
      } else {
        toast.success("Acceso concedido");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("Error inesperado. Intentá de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          disabled={isLoading}
          placeholder="admin@imaykana.com"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          disabled={isLoading}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
