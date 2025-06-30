"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from 'lucide-react';
import { toast } from "sonner";
import { generarValePDF } from "./pdfTemplates";
import {
  validateRTC,
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
  const [expositorDni, setExpositorDNI] = useState("");

  const [rtcNombre, setRtcNombre] = useState("");

  const [qrValue, setQrValue] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const [expositores, setExpositores] = useState<any[]>([]);
  const [loadingExpositores, setLoadingExpositores] = useState(false);

  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState({
    empresa: "",
    rtcDni: "",
    expositorDni: "",
  });

  // Cargar expositores cuando se selecciona una empresa
  useEffect(() => {
    const fetchExpositores = async () => {
      if (!empresa) {
        setExpositores([]);
        return;
      }

      try {
        setLoadingExpositores(true);
        const data = await ObtenerTecnicos();
        setExpositores(data);
      } catch (error) {
        console.error("Error al obtener los expositores", error);
        toast.error("Error al obtener los expositores");
        setExpositores([]);
      } finally {
        setLoadingExpositores(false);
      }
    };

    fetchExpositores();
  }, [empresa]);

  // Limpiar expositor seleccionado cuando cambia la empresa
  useEffect(() => {
    if (empresa) {
      setExpositorDNI("");
      setErrors(prev => ({ ...prev, expositorDni: "" }));
    }
  }, [empresa]);

  const validateForm = () => {
    const newErrors = {
      empresa: "",
      rtcDni: "",
      expositorDni: "",
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
    if (!expositorDni) {
      newErrors.expositorDni = "Por favor seleccione un expositor";
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
      const rtcValidation = await validateRTC(rtcDni);

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
      // Limpiar formulario
      setEmpresa("");
      setRtcDni("");
      setExpositorDNI("");
      setExpositores([]);
      setQrGenerated(false);
      setErrors({
        empresa: "",
        rtcDni: "",
        expositorDni: "",
      });
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
              <Label htmlFor="expositorDni">Expositor</Label>
              <Select 
                value={expositorDni} 
                onValueChange={setExpositorDNI}
                disabled={!empresa || loadingExpositores}
              >
                <SelectTrigger id="expositorDni">
                  <SelectValue 
                    placeholder={
                      !empresa 
                        ? "Primero seleccione una empresa" 
                        : loadingExpositores 
                          ? "Cargando expositores..." 
                          : "Seleccione expositor"
                    } 
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {loadingExpositores ? (
                    <SelectItem value="loading" disabled>
                      Cargando expositores...
                    </SelectItem>
                  ) : expositores.length > 0 ? (
                    expositores.map((expositor) => (
                      <SelectItem key={expositor.id} value={expositor.id}>
                        {expositor.id} - {expositor.opcion}
                      </SelectItem>
                    ))
                  ) : empresa ? (
                    <SelectItem value="no-data" disabled>
                      No hay expositores disponibles
                    </SelectItem>
                  ) : null}
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
                disabled={isValidating || !empresa}
              >
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