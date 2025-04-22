import { ValeProvider, useValeContext } from "@/features/vales/context/vale-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function ResumenFooter() {
  const { productos } = useValeContext()

  const totalItems = productos.reduce((sum, producto) => sum + producto.cantidad, 0)

  const subtotal = productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0)
  const descuento = subtotal * 0.05 // 5% de descuento
  const total = subtotal - descuento

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Atrás
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
              Siguiente <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8">
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">Total de productos:</p>
              <p className="text-xl font-bold">{totalItems} items</p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">Subtotal:</p>
              <p className="font-medium">S/. {subtotal.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Descuento:</p>
              <p className="font-medium text-green-600">- S/. {descuento.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Total:</p>
              <p className="text-xl font-bold">S/. {total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
