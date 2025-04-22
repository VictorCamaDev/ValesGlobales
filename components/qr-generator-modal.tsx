"use client";

import type React from "react";
import { generarValePDF } from "./pdfTemplates"
import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

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

interface QrGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrGeneratorModal({
  open,
  onOpenChange,
}: QrGeneratorModalProps) {
  const [qrValue, setQrValue] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Estado simple para los campos del formulario
  const [empresa, setEmpresa] = useState("");
  const [rtcDni, setRtcDni] = useState("");
  const [exponenteDni, setExponenteDni] = useState("");
  const [numeroVale, setNumeroVale] = useState("");
  const [rtcNombre, setRtcNombre] = useState("");
  const [expoNombre, setExpoNombre] = useState("");

  // Estado para errores de validación
  const [errors, setErrors] = useState({
    empresa: "",
    rtcDni: "",
    exponenteDni: "",
    numeroVale: "",
  });

  const empresas = [
    { id: "1", nombre: "Silvestre" },
    { id: "2", nombre: "Neoagrum" },
  ];

  // Función de validación manual
  const validateForm = () => {
    const newErrors = {
      empresa: "",
      rtcDni: "",
      exponenteDni: "",
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

    if (!exponenteDni || exponenteDni.length !== 8) {
      newErrors.exponenteDni = "El DNI debe tener 8 dígitos";
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
      const ExpoValidation = await validateExponente(exponenteDni);

      if (!rtcValidation.isValid) {
        toast.error(rtcValidation.message);
        setErrors((prev) => ({ ...prev, rtcDni: rtcValidation.message }));
        setIsValidating(false);
        return;
      }
      if (!ExpoValidation.isValid) {
        toast.error(ExpoValidation.message);
        setErrors((prev) => ({
          ...prev,
          exponenteDni: ExpoValidation.message,
        }));
        setIsValidating(false);
        return;
      }

      // Guardar el nombre del RTC para mostrarlo en el PDF
      if (rtcValidation.isValid && ExpoValidation.isValid) {
        setRtcNombre(rtcValidation.message);
        setExpoNombre(ExpoValidation.message);
      }

      // Construir la URL completa con los parámetros
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/vale/nuevo?empresa=${empresa}&rtc=${rtcDni}&exponente=${exponenteDni}&numero=${numeroVale}`;

      setQrValue(url);
      setQrGenerated(true);
      setIsValidating(false);
    } catch (error) {
      console.error("Error al validar RTC:", error);
      toast.error("Error al validar el RTC. Intente nuevamente.");
      setIsValidating(false);
    }
  };

  const downloadQRCodePDF = () => {
    if (!qrRef.current) return
  
    const svg = qrRef.current.querySelector("svg")
    if (!svg) return
  
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return
  
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)
  
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
  
      const imgData = canvas.toDataURL("image/png")
      const empresaNombre = empresas.find((e) => e.id === empresa)?.nombre || ""
      const fecha = new Date().toLocaleDateString()
  
      const pdf = generarValePDF({
        empresaNombre,
        numeroVale,
        rtcDni,
        fecha,
        qrImgData: imgData,
      })
  
      pdf.save(`vale-qr-${numeroVale}.pdf`)
      URL.revokeObjectURL(url)
    }
  
    img.src = url
  }

  const handleBackToForm = () => {
    setQrGenerated(false);
  };

  const handleCloseModal = (newOpen: boolean) => {
    if (!newOpen && !isValidating) {
      // Resetear el estado al cerrar
      if (qrGenerated) {
        setQrGenerated(false);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generar Código QR</DialogTitle>
          <DialogDescription>
            Complete la información para generar un código QR de acceso rápido.
          </DialogDescription>
        </DialogHeader>

        {!qrGenerated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa-qr">Empresa</Label>
              <Select value={empresa} onValueChange={setEmpresa}>
                <SelectTrigger id="empresa-qr">
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
              <Label htmlFor="rtcDni-qr">DNI del RTC</Label>
              <Input
                id="rtcDni-qr"
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
              <Label htmlFor="exponenteDni-qr">DNI del Expositor</Label>
              <Input
                id="exponenteDni-qr"
                value={exponenteDni}
                onChange={(e) => setExponenteDni(e.target.value)}
                maxLength={8}
                placeholder="Ingrese el DNI del expositor"
              />
              {errors.exponenteDni && (
                <p className="text-sm text-red-500">{errors.exponenteDni}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isValidating}>
                {isValidating ? "Validando..." : "Generar QR"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div
              ref={qrRef}
              className="bg-white p-4 rounded-lg border-2 border-emerald-500"
            >
              <QRCodeSVG value={qrValue} size={200} level="H" />
            </div>
            <p className="text-sm text-center text-gray-500">
              Escanee este código QR para acceder directamente al registro de
              vales con los datos precompletados.
            </p>
            <Button
              onClick={downloadQRCodePDF}
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" /> Descargar PDF
            </Button>
            <Button onClick={handleBackToForm} className="w-full">
              Generar otro QR
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
