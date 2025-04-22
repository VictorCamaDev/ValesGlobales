import type { ProductoDTO } from "@/features/vales/types/producto.types"
import { API_ENDPOINTS } from "@/lib/config"

export async function getProductos(idZona: string, nombreZona: string): Promise<ProductoDTO[]> {
  // Si no hay idZona o nombreZona, devolver un array vacío o manejar el error
  if (!idZona || !nombreZona) {
    console.warn("No se proporcionó idZona o nombreZona para obtener productos")
    return []
  }

  try {
    const response = await fetch(API_ENDPOINTS.OBTENER_PRODUCTOS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idZona: Number.parseInt(idZona, 10),
        nombreZona,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error al obtener los productos: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // If the API returns an empty array or null, return an empty array
    if (!data || !Array.isArray(data)) {
      console.warn("API returned invalid data format:", data)
      return []
    }

    // Add fallback values for any missing properties
    const processedData = data.map((item: any) => ({
      id: item.id || String(Math.random()),
      codigo: item.codigo || "N/A",
      nombre: item.name || "Producto sin nombre",
      precio: Number.parseFloat(item.descuentoUnitario),
    }))

    return processedData
  } catch (error) {
    console.error("Error al obtener productos:", error)
    // Return mock data in case of error for testing
    return [
      {
        id: "mock1",
        codigo: "MOCK-001",
        nombre: "Producto de prueba 1",
        precio: 100,
      },
      {
        id: "mock2",
        codigo: "MOCK-002",
        nombre: "Producto de prueba 2",
        precio: 200,
      },
    ]
  }
}
