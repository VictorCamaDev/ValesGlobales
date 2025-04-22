"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { ProductoDTO } from "@/features/vales/types/producto.types"

interface ProductoAutocompleteProps {
  productos: ProductoDTO[]
  onSelect: (product: ProductoDTO) => void
  onCancel: () => void
}

export function ProductoAutocomplete({ productos, onSelect, onCancel }: ProductoAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<ProductoDTO[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Filter products when query changes
  useEffect(() => {
    if (query.length > 1) {
      const filtered = productos.filter(
        (product) =>
          product.nombre.toLowerCase().includes(query.toLowerCase()) ||
          product.codigo.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredProducts(filtered)
      // console.log("Filtered products:", filtered.length) // Debug log
    } else {
      setFilteredProducts([])
    }
  }, [query, productos])

  const handleClearSearch = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar producto por nombre o código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          {query && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={handleClearSearch}
              type="button"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>

      {/* Debug info - remove in production */}
      <div className="text-xs text-gray-500">Total productos disponibles: {productos.length}</div>

      {filteredProducts.length > 0 && (
        <div className="border rounded-md overflow-hidden bg-white shadow-md">
          <div className="max-h-72 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-right">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(product)}>
                    <td className="px-4 py-3 text-sm">{product.codigo}</td>
                    <td className="px-4 py-3 text-sm font-medium">{product.nombre}</td>
                    <td className="px-4 py-3 text-sm text-right">S/ {product.precio.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {query.length > 1 && filteredProducts.length === 0 && (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      )}
    </div>
  )
}
