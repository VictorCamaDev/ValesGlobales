"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ValeRegistroPage } from "@/components/vale-registro-page";
import { Spinner } from "@/components/ui/spinner";
import { validateRTC } from "@/features/vales/services/api-service";
import { toast } from "sonner";
import {
  ValeProvider,
  useValeContext,
} from "@/features/vales/context/vale-context";

export default function NuevoValePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Verificar si hay parámetros en la URL
  const empresa = searchParams.get("empresa");
  const rtc = searchParams.get("rtc");
  const exponente = searchParams.get("exponente");

  // Validar los parámetros
  useEffect(() => {
    const validateParams = async () => {
      // Si no hay parámetros, redirigir a la página principal
      if (!empresa || !rtc || !exponente) {
        toast.error("Faltan parámetros requeridos");
        router.push("/");
        return;
      }

      try {
        // Validar RTC con la API
        const rtcValidation = await validateRTC(rtc);

        if (!rtcValidation.isValid) {
          toast.error(rtcValidation.message);
          router.push("/");
          return;
        }

        setIsValid(true);
        setIsValidating(false);
      } catch (error) {
        console.error("Error al validar RTC:", error);
        toast.error("Error al validar el RTC. Intente nuevamente.");
        router.push("/");
      }
    };

    validateParams();
  }, [empresa, rtc, exponente, router]);

  // Al final del componente, después del useEffect y del if (isValidating)
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Validando información...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">
            Error al cargar la página. Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ValeProvider>
      <ValeRegistroPage />
    </ValeProvider>
  );
}
