import type { ProductoValeDTO } from "@/types/producto.types"

interface TotalsResult {
  totalItems: number
  subtotal: number
  descuento: number
  total: number
}

export function calculateTotals(productos: ProductoValeDTO[]): TotalsResult {
  const totalItems = productos.reduce((sum, producto) => sum + producto.cantidad, 0)

  const subtotal = productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0)

  const descuento = productos.reduce(
    (sum, producto) => sum + producto.precio * producto.cantidad * producto.descuento,
    0,
  )

  const total = subtotal - descuento

  return {
    totalItems,
    subtotal,
    descuento,
    total,
  }
}
