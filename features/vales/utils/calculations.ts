import type { ProductoValeDTO } from "@/features/vales/types/producto.types"

interface TotalsResult {
  totalItems: number
  subtotal: number
  descuento: number
  total: number
}

export function calculateTotals(productos: ProductoValeDTO[]): TotalsResult {
  // Count total items (sum of all quantities)
  const totalItems = productos.reduce((sum, producto) => sum + producto.cantidad, 0)

  // Calculate subtotal (price * quantity for each product)
  const subtotal = productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0)

  // Calculate discount (price * quantity * discount rate for each product)
  const descuento = productos.reduce(
    (sum, producto) => sum + producto.precio * producto.cantidad * producto.descuento,
    0,
  )

  // Calculate total (subtotal - discount)
  const total = subtotal - descuento

  return {
    totalItems,
    subtotal,
    descuento,
    total,
  }
}
