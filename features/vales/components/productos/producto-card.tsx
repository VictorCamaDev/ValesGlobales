"use client"

import type React from "react"

import { useValeContext } from "@/features/vales/context/vale-context"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus, Check, X } from "lucide-react"
import { useState } from "react"
import type { ProductoValeDTO } from "@/features/vales/types/producto.types"

interface ProductoCardProps {
  producto: ProductoValeDTO
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const { updateProductoCantidad, removeProducto } = useValeContext()
  const [isEditing, setIsEditing] = useState(false)
  const [cantidadTemp, setCantidadTemp] = useState(producto.cantidad)

  const handleIncrement = () => {
    if (producto.cantidad != 0) {
      updateProductoCantidad(producto.id, producto.cantidad + 1)
    }
  }

  const handleDecrement = () => {
    if (producto.cantidad > 1) {
      updateProductoCantidad(producto.id, producto.cantidad - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    if (value >= 0) {
      setCantidadTemp(value)
    }
  }

  const handleSave = () => {
    if (cantidadTemp > 0) {
      updateProductoCantidad(producto.id, cantidadTemp)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setCantidadTemp(producto.cantidad)
    setIsEditing(false)
  }

  const subtotal = producto.precio * producto.cantidad
  const descuento = subtotal * producto.descuento
  const total = subtotal - descuento

  return (
    <Card className="overflow-hidden border-gray-200 transition-all hover:shadow-md">
      <CardHeader className="bg-gray-50 p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{producto.nombre}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium font-bold">Cantidad:</span>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={cantidadTemp}
                onChange={handleInputChange}
                className="w-16 h-8 text-center"
                min="1"
              />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:bg-green-50"
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:bg-gray-50"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDecrement}
                disabled={producto.cantidad <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-8 text-center font-medium">{producto.cantidad}</div>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 p-4 border-t">
        <div className="w-full space-y-1">
          <div className="flex justify-between font-medium">
            <span className="text-gray-500">Precio unitario:</span>
            <span>S/ {producto.precio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium pt-1 border-t border-gray-200">
            <span className="text-gray-500">Total Descuento:</span>
            <span className="text-green-600">S/ {descuento.toFixed(2)}</span>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="h-8 w-38 text-red-500 hover:text-red-900 hover:bg-red-50"
              onClick={() => removeProducto(producto.id)}
            >
              <Trash2 className="h-4 w-4" />
              ELIMINAR
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
