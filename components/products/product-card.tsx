"use client"

import { ValeProvider, useValeContext } from "@/features/vales/context/vale-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash, Minus, Plus } from "lucide-react"

interface ProductCardProps {
  producto: any
}

export function ProductCard({ producto }: ProductCardProps) {
  const { updateProductoCantidad, removeProducto } = useValeContext()

  const handleIncrement = () => {
    if (producto.cantidad < producto.stock) {
      updateProductoCantidad(producto.id, producto.cantidad + 1)
    }
  }

  const handleDecrement = () => {
    if (producto.cantidad > 1) {
      updateProductoCantidad(producto.id, producto.cantidad - 1)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{producto.nombre}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeProducto(producto.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          <p>Código: {producto.codigo}</p>
          <p>Precio: S/. {producto.precio.toFixed(2)}</p>
          <p>Stock disponible: {producto.stock}</p>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
            disabled={producto.cantidad <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={producto.cantidad}
            min="1"
            max={producto.stock}
            className="h-8 w-16 mx-2 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
            disabled={producto.cantidad >= producto.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium">Subtotal:</span>
          <span className="font-bold">S/. {(producto.precio * producto.cantidad).toFixed(2)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
