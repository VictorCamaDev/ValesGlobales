"use client"

import { useState } from "react"
import { ValeProvider, useValeContext } from "@/features/vales/context/vale-context"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { ProductAutocomplete } from "@/components/products/product-autocomplete"
import { ProductCard } from "@/components/products/product-card"
import { Plus } from "lucide-react"

export function DetalleGuia() {
  const { productos, addProducto } = useValeContext()
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  return (
    <div className="border border-gray-200 rounded-md shadow-sm">
      <SectionHeader title="DETALLE DE GUÍA" />
      <div className="p-4 bg-white rounded-b-md">
        
        {productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay productos agregados. Haga clic en "Añadir Producto" para comenzar.
          </div>
        )}
      </div>
    </div>
  )
}
