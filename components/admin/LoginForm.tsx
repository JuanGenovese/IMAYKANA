"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoginForm } from "@/hooks/useLoginForm";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    isRegister,
    setIsRegister,
    isResetPass,
    setIsResetPass,
    verContrasena,
    setVerContrasena,
  } = useLoginForm();

  return (
    <div
      className={cn(
        "mt-10 mb-10 w-full flex flex-col items-center justify-center transition-all ease-in-out duration-300",
        isRegister && !isResetPass ? "max-w-[480px]" : "max-w-[420px]"
      )}
    >
      {/* Header Section */}
      <div className="text-center flex flex-col items-center w-full mb-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 transition-all duration-300">
          {isResetPass
            ? "Recuperar contraseña"
            : isRegister
              ? "Registro"
              : "Inicio de Sesión"}
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-sm transition-all duration-300">
          {isResetPass
            ? "Ingresá tu correo para restablecer tu contraseña."
            : isRegister
              ? "Creá una cuenta y empezá a comprar o vender."
              : "Ingresá tus credenciales para continuar."}
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full relative z-10 flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm w-full relative z-10 mt-2"
        >
          {/* Sección de Campos Animados para Registro */}
          <div
            className={cn(
              "grid transition-all ease-in-out overflow-hidden origin-top duration-300",
              isRegister && !isResetPass
                ? "grid gap-3 max-h-[400px] opacity-100 scale-100 py-1"
                : "grid gap-0 max-h-0 opacity-0 scale-95 pointer-events-none py-0"
            )}
          >
            {/* Nombre y Apellido uno al lado del otro */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="nombre"
                  className="text-xs font-semibold text-gray-500"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej. Juan"
                  {...register("nombre")}
                  className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <p className="text-[10px] text-red-600 font-medium">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="apellido"
                  className="text-xs font-semibold text-gray-500"
                >
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  placeholder="Ej. Pérez"
                  {...register("apellido")}
                  className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
                  disabled={isLoading}
                />
                {errors.apellido && (
                  <p className="text-[10px] text-red-600 font-medium">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
            </div>

            {/* DNI */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="nDni"
                className="text-xs font-semibold text-gray-500"
              >
                DNI
              </label>
              <input
                id="nDni"
                type="text"
                placeholder="Ej. 35444888"
                {...register("nDni")}
                className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
                disabled={isLoading}
              />
              {errors.nDni && (
                <p className="text-[10px] text-red-600 font-medium">
                  {errors.nDni.message}
                </p>
              )}
            </div>

            {/* Selector de Rol */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500">
                Rol de usuario
              </span>
              <label className="flex items-center gap-3 bg-gray-50 border rounded-xl p-2.5 cursor-pointer hover:bg-gray-100/50 transition">
                <input
                  type="checkbox"
                  {...register("isVendedor")}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                  disabled={isLoading}
                />
                <div className="text-sm">
                  <span className="font-semibold block text-gray-700 text-xs">
                    Registrarme como Vendedor
                  </span>
                  <span className="text-[9px] text-gray-500 leading-tight block">
                    Tené en cuenta que si seleccionas este campo, la cuenta debe
                    ser aprobada por un administrador por lo que el alta no será
                    instantanea.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Campo Email (siempre visible) */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-gray-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
              disabled={isLoading}
              placeholder="imaykana@gmail.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div
            className={cn(
              "flex flex-col gap-1 transition-all ease-in-out overflow-hidden origin-top duration-300",
              !isResetPass
                ? "max-h-[150px] opacity-100 scale-100 py-1"
                : "max-h-0 opacity-0 scale-95 pointer-events-none py-0"
            )}
          >
            <label
              htmlFor="password"
              className="text-xs font-semibold text-gray-500"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={verContrasena ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-lg border border-gray-300 pl-3.5 pr-10 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
                disabled={isLoading}
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
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
            {!isRegister && (
              <div className="flex justify-end mt-0.5">
                <button
                  type="button"
                  onClick={() => setIsResetPass(true)}
                  className="text-[11px] text-gray-500 hover:text-gray-950 hover:underline cursor-pointer"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
          </div>

          {/* Botón de Acción Principal */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60 cursor-pointer"
          >
            {isLoading
              ? isResetPass
                ? "Enviando..."
                : isRegister
                  ? "Registrando..."
                  : "Ingresando..."
              : isResetPass
                ? "Recuperar contraseña"
                : isRegister
                  ? "Registrarme"
                  : "Ingresar"}
          </button>
        </form>

        {/* Switch de modo abajo del formulario */}
        <div className="text-center text-xs text-gray-500 mt-3">
          {isResetPass ? (
            <p>
              ¿Te acordás de tu contraseña?{" "}
              <button
                type="button"
                onClick={() => setIsResetPass(false)}
                className="font-semibold text-gray-950 hover:underline cursor-pointer"
              >
                Iniciá sesión
              </button>
            </p>
          ) : isRegister ? (
            <p>
              ¿Ya tenés cuenta?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-semibold text-gray-950 hover:underline cursor-pointer"
              >
                Iniciá sesión
              </button>
            </p>
          ) : (
            <p>
              ¿No tenés cuenta?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-semibold text-gray-950 hover:underline cursor-pointer"
              >
                Registrate
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
