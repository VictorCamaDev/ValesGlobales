"use client"

import { useState } from "react"
import { useValeContext } from "@/features/vales/context/vale-context"
import { saveVale } from "@/features/vales/services/vale-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export function ValeRegistroForm() {
  const { vale, productos } = useValeContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      await saveVale({
        vale,
        productos,
      })

      toast({
        title: "Vale guardado correctamente",
        description: `Se ha registrado el vale con número ${vale.numero}`,
      })
    } catch (error) {
      console.error("Error al guardar el vale:", error)
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el vale. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || productos.length === 0}
        className="bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        {isSubmitting ? (
          <>Guardando...</>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" /> Guardar Vale
          </>
        )}
      </Button>
      <Toaster />
    </div>
  )
}
