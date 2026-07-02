import React from "react";

interface LoginFormHeaderProps {
  isResetPass: boolean;
  isRegister: boolean;
}

export function LoginFormHeader({ isResetPass, isRegister }: LoginFormHeaderProps) {
  return (
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
  );
}
