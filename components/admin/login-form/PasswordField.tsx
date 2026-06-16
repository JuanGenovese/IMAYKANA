import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthFormValues } from "@/lib/schemas/auth";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  register: UseFormRegister<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
  isLoading: boolean;
  isResetPass: boolean;
  isRegister: boolean;
  verContrasena: boolean;
  setVerContrasena: (val: boolean) => void;
  setIsResetPass: (val: boolean) => void;
}

export function PasswordField({
  register,
  errors,
  isLoading,
  isResetPass,
  isRegister,
  verContrasena,
  setVerContrasena,
  setIsResetPass,
}: PasswordFieldProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 transition-all ease-in-out overflow-hidden origin-top duration-300",
        !isResetPass
          ? "max-h-[150px] opacity-100 scale-100 py-1"
          : "max-h-0 opacity-0 scale-95 pointer-events-none py-0"
      )}
    >
      <label htmlFor="password" className="text-xs font-semibold text-gray-500">
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
  );
}
