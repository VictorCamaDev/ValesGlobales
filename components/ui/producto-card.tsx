"use client"

import type React from "react"

import { useState } from "react"
import { ValeProvider, useValeContext } from "@/features/vales/context/vale-context"
import type { ProductoValeDTO } from "@/types/producto.types"

interface ProductoCardProps {
  producto: ProductoValeDTO
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const { updateProductoCantidad, removeProducto } = useValeContext()
  const [isEditing, setIsEditing] = useState(false)
  const [cantidadTemp, setCantidadTemp] = useState(producto.cantidad)

  const handleIncrement = () => {
    if (producto.cantidad > 0) {
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

  // Update the subtotal and total calculation
  const subtotal = producto.precio * producto.cantidad
  const descuento = subtotal
  const total = subtotal - descuento

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
          <span className="text-sm text-gray-600 font-bold text-lg">{producto.nombre}</span>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={cantidadTemp}
                onChange={handleInputChange}
                className="form-input w-16 h-8 text-center text-sm"
                min="1"
              />
              <div className="flex gap-1">
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-md text-green-600 hover:bg-green-50"
                  onClick={handleSave}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-50"
                  onClick={handleCancel}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                onClick={handleDecrement}
                disabled={producto.cantidad <= 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-minus"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <div className="w-8 text-center font-medium">{producto.cantidad}</div>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                onClick={handleIncrement}
                disabled={producto.cantidad == 12}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-plus"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>              
            </div>
          )}
        </div>
      </div>

      <div className=" p-3 border-t space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Precio unitario:</span>
          <span>S/ {producto.precio.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Cantidad:</span>
          <span>{producto.cantidad}</span>
        </div>
        <div className=" text-green-600 flex justify-between font-medium pt-1 border-t border-gray-200">
          <span>Total Descuento:</span>
          <span>S/ {descuento.toFixed(2)}</span>
        </div>
        <div className="pt-2 mt-2 border-t border-gray-200">
          <button
            className="w-full btn btn-sm flex items-center justify-center gap-1 text-red-500 hover:bg-red-50 border border-red-200"
            onClick={() => removeProducto(producto.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
