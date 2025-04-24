"use client"

import { useState, useEffect, useRef } from "react"
import type { ProductoDTO } from "@/types/producto.types"

interface ProductoAutocompleteProps {
  productos: ProductoDTO[]
  onSelect: (product: ProductoDTO) => void
  onCancel: () => void
}

export function ProductoAutocomplete({ productos, onSelect, onCancel }: ProductoAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<ProductoDTO[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      const filtered = productos.filter(
        (product) =>
          product.nombre.toLowerCase().includes(query.toLowerCase()) ||
          product.codigo.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [query, productos])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar producto por nombre o código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input pl-10"
          />
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
            className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          {query && (
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setQuery("")}>
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
                className="lucide lucide-x text-gray-500"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
        <button className="btn btn-outline" onClick={onCancel}>
          Cancelar
        </button>
      </div>

      {filteredProducts.length > 0 && (
        <div className="border rounded-md overflow-hidden bg-white shadow-md">
          <div className="max-h-72 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-right">Descuento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(product)}>
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
