"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { productosDisponibles } from "@/lib/data"

interface ProductAutocompleteProps {
  onSelect: (product: any) => void
  onCancel: () => void
}

export function ProductAutocomplete({ onSelect, onCancel }: ProductAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      const filtered = productosDisponibles.filter((product) =>
        product.nombre.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredProducts(filtered)
      setIsOpen(true)
    } else {
      setFilteredProducts([])
      setIsOpen(false)
    }
  }, [query])

  const handleSelect = (product) => {
    onSelect(product)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar producto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          {query && (
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setQuery("")}>
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>

      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(product)}
            >
              <div className="font-medium">{product.nombre}</div>
              <div className="text-sm text-gray-500">
                Precio: S/. {product.precio.toFixed(2)} | Stock: {product.stock}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length > 1 && filteredProducts.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
          No se encontraron productos
        </div>
      )}
    </div>
  )
}
