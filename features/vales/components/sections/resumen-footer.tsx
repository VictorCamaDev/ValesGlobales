"use client"

import { useValeContext } from "@/features/vales/context/vale-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import { calculateTotals } from "@/features/vales/utils/calculations"

interface ResumenFooterProps {
  onSubmit: () => void
  isSubmitting: boolean
}

export function ResumenFooter({ onSubmit, isSubmitting }: ResumenFooterProps) {
  const { productos, saveVale } = useValeContext()
  const { totalItems, subtotal, descuento, total } = calculateTotals(productos)

  return (
    <footer className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-6 shadow-md z-10 mt-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Atrás
            </Button>
            <Button
              onClick={saveVale}
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
          </div>

          <div className="text-right">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Descuento:</span>
                <span className="text-green-600">- S/ {descuento.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-end items-center gap-2">
                <span className="text-gray-500">Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
