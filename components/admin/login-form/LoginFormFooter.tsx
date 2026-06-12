import React from "react";

interface LoginFormFooterProps {
  isResetPass: boolean;
  isRegister: boolean;
  setIsResetPass: (val: boolean) => void;
  setIsRegister: (val: boolean) => void;
}

export function LoginFormFooter({
  isResetPass,
  isRegister,
  setIsResetPass,
  setIsRegister,
}: LoginFormFooterProps) {
  return (
    <div className="text-center text-xs text-gray-500 mt-3">
      {isResetPass ? (
        <p>
          ¿Te acordás de tu contraseña?{" "}
          <button
            type="button"
            onClick={() => {
              setIsResetPass(false);
              setIsRegister(false);
            }}
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
            onClick={() => {
              setIsResetPass(false);
              setIsRegister(false);
            }}
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
            onClick={() => {
              setIsResetPass(false);
              setIsRegister(true);
            }}
            className="font-semibold text-gray-950 hover:underline cursor-pointer"
          >
            Registrate
          </button>
        </p>
      )}
    </div>
  );
}
