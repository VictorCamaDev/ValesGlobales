"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  validateRTC,
  validateExponente,
} from "@/features/vales/services/api-service";
import { ObtenerTecnicos } from "@/features/vales/services/api-service";

interface RegistroValeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistroValeModal({
  open,
  onOpenChange,
}: RegistroValeModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Estado simple para los campos del formulario
  const [empresa, setEmpresa] = useState("");
  const [rtcDni, setRtcDni] = useState("");
  const [exponenteDni, setExponenteDni] = useState("");
  const [expositorDni, setExpositorDNI] = useState("");
  const [numeroVale, setNumeroVale] = useState("");

  // Estado para errores de validación
  const [errors, setErrors] = useState({
    empresa: "",
    rtcDni: "",
    expositorDni: "",
    numeroVale: "",
  });

  // Estado para las empresas
  const empresas = [
    { id: "1", nombre: "Silvestre" },
    { id: "2", nombre: "Neoagrum" },
  ];

  // Estado para los técnicos
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState(true);

  // Cargar técnicos desde la API
  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const data = await ObtenerTecnicos();
        setTecnicos(data);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener los técnicos", error);
        toast.error("Error al obtener los técnicos");
      } finally {
        setLoadingTecnicos(false);
      }
    };

    fetchTecnicos();
  }, []);

  // Función de validación manual
  const validateForm = () => {
    const newErrors = {
      empresa: "",
      rtcDni: "",
      expositorDni: "",
      numeroVale: "",
    };

    let isValid = true;

    if (!empresa) {
      newErrors.empresa = "Por favor seleccione una empresa";
      isValid = false;
    }

    if (!rtcDni || rtcDni.length !== 8) {
      newErrors.rtcDni = "El DNI debe tener 8 dígitos";
      isValid = false;
    }

    if (!expositorDni || expositorDni.length !== 8) {
      newErrors.expositorDni = "El DNI debe tener 8 dígitos";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsValidating(true);

    try {
      // Validar RTC con la API
      const rtcValidation = await validateRTC(rtcDni);

      if (!rtcValidation.isValid) {
        toast.error(rtcValidation.message);
        setErrors((prev) => ({ ...prev, rtcDni: rtcValidation.message }));
        setIsValidating(false);
        return;
      }

      setIsLoading(true);

      // Construir la URL con los parámetros
      const url = `/vale/nuevo?empresa=${empresa}&rtc=${rtcDni}&exponente=${expositorDni}`;

      // Redirigir a la página de registro con los parámetros
      setTimeout(() => {
        router.push(url);
        setIsLoading(false);
        onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error("Error al validar RTC:", error);
      toast.error("Error al validar el RTC. Intente nuevamente.");
      setIsValidating(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) =>
        !isLoading && !isValidating && onOpenChange(newOpen)
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Vale</DialogTitle>
          <DialogDescription>
            Complete la información para continuar con el registro del vale.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Select value={empresa} onValueChange={setEmpresa}>
              <SelectTrigger id="empresa">
                <SelectValue placeholder="Seleccione una empresa" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.empresa && (
              <p className="text-sm text-red-500">{errors.empresa}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rtcDni">DNI del RTC</Label>
            <Input
              id="rtcDni"
              value={rtcDni}
              onChange={(e) => setRtcDni(e.target.value)}
              maxLength={8}
              placeholder="Ingrese el DNI del RTC"
            />
            {errors.rtcDni && (
              <p className="text-sm text-red-500">{errors.rtcDni}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="exponenteDni">Datos del Expositor</Label>
            <Select value={expositorDni} onValueChange={setExpositorDNI}>
              <SelectTrigger id="exponenteDni">
                <SelectValue placeholder="Seleccione expositor" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {loadingTecnicos ? (
                  <SelectItem value="loading" disabled>
                    Cargando técnicos...
                  </SelectItem>
                ) : (
                  tecnicos.map((tecnico) => (
                    <SelectItem key={tecnico.id} value={tecnico.id}>
                      {tecnico.id + ' - ' + tecnico.opcion}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.expositorDni && (
              <p className="text-sm text-red-500">{errors.expositorDni}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isValidating}
            >
              {isValidating
                ? "Validando..."
                : isLoading
                ? "Procesando..."
                : "Continuar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
