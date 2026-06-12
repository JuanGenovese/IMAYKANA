"use client";

import { Eye, EyeOff } from "lucide-react";
import { useUpdatePasswordForm } from "@/hooks/useUpdatePasswordForm";

export function FormularioActualizarContrasena() {
  const {
    register,
    handleSubmit,
    alEnviar,
    errores,
    estaCargando,
    estaPermitido,
    estaVerificando,
    verContrasena,
    setVerContrasena,
  } = useUpdatePasswordForm();

  if (estaVerificando) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-[420px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4" />
        <p className="text-sm text-gray-500">
          Verificando enlace de recuperación...
        </p>
      </div>
    );
  }

  if (!estaPermitido) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-[500px] h-[20vh] rounded-xl border border-gray-200 bg-white shadow-sm w-full">
        <h2 className="text-xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
        <p className="text-m text-gray-500 mb-4">
          El enlace de recuperación es inválido o expiró. Por favor, solicitá
          uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col items-center justify-center transition-all ease-in-out duration-300">
      <div className="text-center flex flex-col items-center w-full mb-4">
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
              className="w-full rounded-lg border border-gray-300 pl-3.5 pr-10 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
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
              className="w-full rounded-lg border border-gray-300 pl-3.5 pr-10 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
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
          className="mt-2 flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60 cursor-pointer"
        >
          {estaCargando ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </form>
    </div>
  );
}
