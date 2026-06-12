"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { z } from "zod";
import {
  AuthFormValues,
  loginSchema,
  registerSchema,
} from "@/components/admin/Schemas/LoginSchemas";
import { obtenerUsuarioPorId } from "@/actions/usuarios";

const resetSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  nDni: z.string().optional(),
  isVendedor: z.boolean().optional(),
});

export function useLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isResetPass, setIsResetPass] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(
      isResetPass ? resetSchema : isRegister ? registerSchema : loginSchema
    ) as Resolver<AuthFormValues>,
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      nDni: "",
      isVendedor: false,
    },
  });

  // Reset form when switching mode
  useEffect(() => {
    reset({
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      nDni: "",
      isVendedor: false,
    });
  }, [isRegister, isResetPass, reset]);

  const handleSendResetEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login/update-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(
          "Te enviamos un correo con las instrucciones para restablecer tu contraseña."
        );
        setIsResetPass(false);
      }
    } catch (err) {
      console.error("Error al solicitar restablecimiento de contraseña:", err);
      toast.error("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormValues) => {
    if (isResetPass) {
      await handleSendResetEmail(data.email);
      return;
    }
    setIsLoading(true);
    try {
      const supabase = createSupabaseClient();

      if (isRegister) {
        if (!data.nombre || !data.apellido || !data.nDni) {
          toast.error("Por favor complete todos los campos.");
          setIsLoading(false);
          return;
        }

        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              nombre: data.nombre,
              apellido: data.apellido,
              nDni: data.nDni,
              solicitud_vendedor: data.isVendedor || false,
            },
          },
        });

        if (error) {
          toast.error(error.message);
        } else if (authData.user) {
          const userProfile = await obtenerUsuarioPorId(authData.user.id);
          if (userProfile.success && userProfile.usuario) {
            localStorage.setItem("user", JSON.stringify(userProfile.usuario));
          }

          toast.success(
            "¡Registro exitoso! Por favor confirmá tu correo para activar la cuenta."
          );
          router.push("/productos");
          router.refresh();
          setIsRegister(false);
        }
      } else {
        const { data: authData, error } =
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

        if (error) {
          toast.error("Credenciales incorrectas.");
        } else if (authData.user) {
          const userProfile = await obtenerUsuarioPorId(authData.user.id);
          if (userProfile.success && userProfile.usuario) {
            localStorage.setItem("user", JSON.stringify(userProfile.usuario));
            toast.success(
              `Acceso concedido. ¡Hola, ${userProfile.usuario.nombre}!`
            );
            router.push("/dashboard");
            router.refresh();
          } else {
            toast.error(
              userProfile.error ||
              "No se pudo recuperar el perfil del usuario."
            );
          }
        }
      }
    } catch (err) {
      toast.error("Error inesperado. Intentá de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}