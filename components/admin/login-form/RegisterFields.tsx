import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthFormValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

interface RegisterFieldsProps {
  register: UseFormRegister<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
  isLoading: boolean;
  isRegister: boolean;
  isResetPass: boolean;
}

export function RegisterFields({
  register,
  errors,
  isLoading,
  isRegister,
  isResetPass,
}: RegisterFieldsProps) {
  return (
    <div
      className={cn(
        "grid transition-all ease-in-out overflow-hidden origin-top duration-300",
        isRegister && !isResetPass
          ? "grid gap-3 max-h-[400px] opacity-100 scale-100 py-1"
          : "grid gap-0 max-h-0 opacity-0 scale-95 pointer-events-none py-0"
      )}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="nombre" className="text-xs font-semibold text-gray-500">
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
          <label htmlFor="apellido" className="text-xs font-semibold text-gray-500">
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

      <div className="flex flex-col gap-1">
        <label htmlFor="nDni" className="text-xs font-semibold text-gray-500">
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
  );
}
