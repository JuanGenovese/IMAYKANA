"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const esquemaActualizarContrasena = z
  .object({
    contrasena: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmarContrasena: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
  })
  .refine((datos) => datos.contrasena === datos.confirmarContrasena, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarContrasena"],
  });

type ValoresFormularioActualizarContrasena = z.infer<
  typeof esquemaActualizarContrasena
>;

export function FormularioActualizarContrasena() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [estaCargando, setEstaCargando] = useState(false);
  const [estaPermitido, setEstaPermitido] = useState(false);
  const [estaVerificando, setEstaVerificando] = useState(true);
  const [code, setCode] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: errores },
  } = useForm<ValoresFormularioActualizarContrasena>({
    resolver: zodResolver(esquemaActualizarContrasena),
    defaultValues: {
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  useEffect(() => {
    const procesarAutenticacion = async () => {
      const parametros = new URLSearchParams(window.location.search);
      const codigo = parametros.get("code");

      if (codigo) {
        setCode(codigo);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        setEstaPermitido(true);
        setEstaVerificando(false);
        return;
      }
    };

    procesarAutenticacion();
  }, [router]);

  const alEnviar = async (datos: ValoresFormularioActualizarContrasena) => {
    setEstaCargando(true);
    try {
      const { error: errorIntercambio } =
        await supabase.auth.exchangeCodeForSession(code);

      if (errorIntercambio) {
        console.error("Error al intercambiar código:", errorIntercambio);
        toast.error("El enlace de recuperación venció o es inválido.");
        setEstaPermitido(false);
        setEstaVerificando(false);
        return;
      }

      const {
        data: { session: sesion },
      } = await supabase.auth.getSession();

      if (sesion) {
        setEstaPermitido(true);
        setEstaVerificando(false);
      } else {
        toast.error("Enlace de recuperación inválido o expirado.");
        setEstaPermitido(false);
        setEstaVerificando(false);
      }

      const { error: errorAuth } = await supabase.auth.updateUser({
        password: datos.contrasena,
      });

      if (errorAuth) {
        toast.error(errorAuth.message);
      } else {
        toast.success("Contraseña actualizada con éxito.");

        await supabase.auth.signOut();
        localStorage.removeItem("user");

        router.push("/login");
        router.refresh();
      }
    } catch (errorInesperado) {
      console.error("Error al actualizar la contraseña:", errorInesperado);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setEstaCargando(false);
    }
  };

  if (estaVerificando) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-[360px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4" />
        <p className="text-sm text-gray-500">
          Verificando enlace de recuperación...
        </p>
      </div>
    );
  }

  if (!estaPermitido) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-[360px] rounded-xl border border-gray-200 bg-white shadow-sm w-full">
        <h2 className="text-lg font-bold text-red-600 mb-2">Acceso Denegado</h2>
        <p className="text-xs text-gray-500 mb-4">
          No tenés permisos para acceder a esta página. Por favor, solicitá un
          nuevo enlace de restablecimiento.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 cursor-pointer"
        >
          Volver al Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[360px] flex flex-col items-center justify-center transition-all ease-in-out duration-300">
      <div className="text-center flex flex-col items-center w-full mb-4">
        <span className="leading-tight mb-4">
          <span className="block text-xl sm:text-2xl font-serif font-bold tracking-normal text-gray-900">
            IMAYKANA
          </span>
          <span className="block text-xs text-muted-foreground">
            moda circular
          </span>
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Nueva Contraseña
        </h1>
        <p className="mt-1.5 text-xs text-gray-500 max-w-xs">
          Ingresá tu nueva contraseña para IMAYKANA.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(alEnviar)}
        className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm w-full relative z-10 animate-fade-in"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="contrasena"
            className="text-xs font-semibold text-gray-500"
          >
            Nueva contraseña
          </label>
          <div className="relative flex items-center">
            <input
              id="contrasena"
              type={verContrasena ? "text" : "password"}
              {...register("contrasena")}
              className="w-full rounded-lg border border-gray-300 pl-3 pr-10 py-1.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
              disabled={estaCargando}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setVerContrasena(!verContrasena)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {verContrasena ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errores.contrasena && (
            <p className="text-xs text-red-600">{errores.contrasena.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmarContrasena"
            className="text-xs font-semibold text-gray-500"
          >
            Confirmar contraseña
          </label>
          <div className="relative flex items-center">
            <input
              id="confirmarContrasena"
              type={verContrasena ? "text" : "password"}
              {...register("confirmarContrasena")}
              className="w-full rounded-lg border border-gray-300 pl-3 pr-10 py-1.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
              disabled={estaCargando}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setVerContrasena(!verContrasena)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {verContrasena ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          {errores.confirmarContrasena && (
            <p className="text-xs text-red-600">
              {errores.confirmarContrasena.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={estaCargando}
          className="mt-2 flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60 cursor-pointer"
        >
          {estaCargando ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </form>
    </div>
  );
}
