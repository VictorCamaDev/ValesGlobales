"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { validateRTC, validateExponente } from "@/features/vales/services/api-service"

interface RegistroValeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegistroValeModal({ open, onOpenChange }: RegistroValeModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  // Estado simple para los campos del formulario
  const [empresa, setEmpresa] = useState("")
  const [rtcDni, setRtcDni] = useState("")
  const [exponenteDni, setExponenteDni] = useState("")
  const [numeroVale, setNumeroVale] = useState("")

  // Estado para errores de validación
  const [errors, setErrors] = useState({
    empresa: "",
    rtcDni: "",
    exponenteDni: "",
    numeroVale: "",
  })

  const empresas = [
    { id: "1", nombre: "Silvestre" },
    { id: "2", nombre: "Neoagrum" },
  ]

  // Función de validación manual
  const validateForm = () => {
    const newErrors = {
      empresa: "",
      rtcDni: "",
      exponenteDni: "",
      numeroVale: "",
    }

    let isValid = true

    if (!empresa) {
      newErrors.empresa = "Por favor seleccione una empresa"
      isValid = false
    }

    if (!rtcDni || rtcDni.length !== 8) {
      newErrors.rtcDni = "El DNI debe tener 8 dígitos"
      isValid = false
    }

    if (!exponenteDni || exponenteDni.length !== 8) {
      newErrors.exponenteDni = "El DNI debe tener 8 dígitos"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsValidating(true)

    try {
      // Validar RTC con la API
            const rtcValidation = await validateRTC(rtcDni)
            const ExpoValidation = await validateExponente(exponenteDni)
      
            if (!rtcValidation.isValid) {
              toast.error(rtcValidation.message)
              setErrors((prev) => ({ ...prev, rtcDni: rtcValidation.message }))
              setIsValidating(false)
              return
            }
            if (!ExpoValidation.isValid) {
              toast.error(ExpoValidation.message)
              setErrors((prev) => ({ ...prev, exponenteDni: ExpoValidation.message }))
              setIsValidating(false)
              return
            }
      

      setIsLoading(true)

      // Construir la URL con los parámetros
      const url = `/vale/nuevo?empresa=${empresa}&rtc=${rtcDni}&exponente=${exponenteDni}`

      // Redirigir a la página de registro con los parámetros
      setTimeout(() => {
        router.push(url)
        setIsLoading(false)
        onOpenChange(false)
      }, 500)
    } catch (error) {
      console.error("Error al validar RTC:", error)
      toast.error("Error al validar el RTC. Intente nuevamente.")
      setIsValidating(false)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !isLoading && !isValidating && onOpenChange(newOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Vale</DialogTitle>
          <DialogDescription>Complete la información para continuar con el registro del vale.</DialogDescription>
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
            {errors.empresa && <p className="text-sm text-red-500">{errors.empresa}</p>}
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
            {errors.rtcDni && <p className="text-sm text-red-500">{errors.rtcDni}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="exponenteDni">DNI del Expositor</Label>
            <Input
              id="exponenteDni"
              value={exponenteDni}
              onChange={(e) => setExponenteDni(e.target.value)}
              maxLength={8}
              placeholder="Ingrese el DNI del expositor"
            />
            {errors.exponenteDni && <p className="text-sm text-red-500">{errors.exponenteDni}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isLoading || isValidating}>
              {isValidating ? "Validando..." : isLoading ? "Procesando..." : "Continuar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
