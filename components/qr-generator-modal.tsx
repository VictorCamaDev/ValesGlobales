"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { generarValePDF } from "./pdfTemplates";
import {
  validateRTC,
  validateExponente,
  ObtenerTecnicos
} from "@/features/vales/services/api-service";

// UI Components
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

interface QrGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPRESAS = [
  { id: "1", nombre: "Silvestre" },
  { id: "2", nombre: "Neoagrum" },
];

export function QrGeneratorModal({ open, onOpenChange }: QrGeneratorModalProps) {
  const [empresa, setEmpresa] = useState("");
  const [rtcDni, setRtcDni] = useState("");
  const [exponenteDni, setExponenteDni] = useState("");
  const [expositorDni, setExpositorDNI] = useState("");
  const [numeroVale, setNumeroVale] = useState("");

  const [rtcNombre, setRtcNombre] = useState("");
  const [expoNombre, setExpoNombre] = useState("");

  const [qrValue, setQrValue] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loadingTecnicos, setLoadingTecnicos] = useState(true);

  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState({
    empresa: "",
    rtcDni: "",
    expositorDni: "",
    numeroVale: "",
  });

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const data = await ObtenerTecnicos();
        setTecnicos(data);
      } catch (error) {
        console.error("Error al obtener los técnicos", error);
        toast.error("Error al obtener los técnicos");
      } finally {
        setLoadingTecnicos(false);
      }
    };

    fetchTecnicos();
  }, []);

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
    if (!validateForm()) return;

    setIsValidating(true);

    try {
      const [rtcValidation, expoValidation] = await Promise.all([
        validateRTC(rtcDni),
        validateExponente(exponenteDni),
      ]);

      if (!rtcValidation.isValid) {
        toast.error(rtcValidation.message);
        setErrors((prev) => ({ ...prev, rtcDni: rtcValidation.message }));
        return;
      }

      setRtcNombre(rtcValidation.message);

      const baseUrl = window.location.origin;
      const url = `${baseUrl}/vale/nuevo?empresa=${empresa}&rtc=${rtcDni}&exponente=${expositorDni}`;

      setQrValue(url);
      setQrGenerated(true);
    } catch (error) {
      console.error("Error al validar RTC:", error);
      toast.error("Error al validar el RTC. Intente nuevamente.");
    } finally {
      setIsValidating(false);
    }
  };

  const downloadQRCodePDF = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL("image/png");
      const empresaNombre = EMPRESAS.find((e) => e.id === empresa)?.nombre || "";
      const fecha = new Date().toLocaleDateString();

      const pdf = generarValePDF({
        empresaNombre,
        rtcDni,
        fecha,
        qrImgData: imgData,
      });

      pdf.save(`vale-qr-${empresaNombre}.pdf`);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handleCloseModal = (newOpen: boolean) => {
    if (!newOpen && !isValidating) {
      setQrGenerated(false);
      onOpenChange(false);
    }
  };

  const handleBackToForm = () => setQrGenerated(false);

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
                  {EMPRESAS.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nombre}
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
                        {tecnico.id + " - " + tecnico.opcion}
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
              Escanee este código QR para acceder directamente al registro de vales con los datos precompletados.
            </p>
            <Button onClick={downloadQRCodePDF} className="w-full" variant="outline">
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
