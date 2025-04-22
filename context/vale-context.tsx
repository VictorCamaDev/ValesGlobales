"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { ValeDTO } from "@/types/vale.types"
import type { ProductoDTO, ProductoValeDTO } from "@/types/producto.types"
import { saveValeService } from "@/services/vale-service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ValeContextType {
  vale: ValeDTO
  updateVale: (data: Partial<ValeDTO>) => void
  productos: ProductoValeDTO[]
  addProducto: (producto: ProductoDTO) => void
  updateProductoCantidad: (id: string, cantidad: number) => void
  removeProducto: (id: string) => void
  isLoading: string
  setIsLoading: (value: string) => void
  isSaving: boolean
  setIsSaving: (value: boolean) => void
  saveVale: () => Promise<void>
}

const ValeContext = createContext<ValeContextType | undefined>(undefined)

export function ValeProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [vale, setVale] = useState<ValeDTO>({
    numero: "",
    idExpositor: "",
    idExponente: "",
    nombreAgricultor: "",
    dni: "",
    cultivo: "",
    area: "",
    longitudX: "",
    latitudY: "",
    codigoRTC: "",
    nombreRTC: "",
    lugarCanje: "",
    idLugarCanje: "",
    fechaEmision: "",
    fechaVigencia: "",
    observaciones: "",
    celular: "",
    cultivoSecundario: "",
    areaSecundaria: "",
    codigoEmpresa: "",
  })

  // Rest of the code remains the same
  const [productos, setProductos] = useState<ProductoValeDTO[]>([])
  const [isLoading, setIsLoading] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const updateVale = (data: Partial<ValeDTO>) => {
    setVale((prev) => ({ ...prev, ...data }))
  }

  const addProducto = (producto: ProductoDTO) => {
    const existingProductIndex = productos.findIndex((p) => p.id === producto.id)

    if (existingProductIndex >= 0) {
      const updatedProductos = [...productos]
      updatedProductos[existingProductIndex].cantidad += 1
      setProductos(updatedProductos)
    } else {
      setProductos([
        ...productos,
        {
          ...producto,
          cantidad: 1,
          descuento: producto.precio, // Default discount
        },
      ])
    }
  }

  const updateProductoCantidad = (id: string, cantidad: number) => {
    setProductos(productos.map((producto) => (producto.id === id ? { ...producto, cantidad } : producto)))
  }

  const removeProducto = (id: string) => {
    setProductos(productos.filter((producto) => producto.id !== id))
  }

  const saveVale = async () => {
    if (productos.length === 0) {
      toast.warning("Debe agregar al menos un producto al vale")
      return
    }

    try {
      setIsSaving(true)
      toast.info("Guardando vale...")

      const result = await saveValeService({
        vale,
        productos: productos.map((p) => ({
          id: p.id,
          cantidad: p.cantidad,
          precio: p.precio,
          descuento: p.descuento,
        })),
      })

      toast.success(`Vale guardado correctamente: ${vale.numero}`)
      router.push(`/vale/confirmacion?numero=${vale.numero}`)
    } catch (error) {
      console.error("Error al guardar el vale:", error)
      toast.error("No se pudo guardar el vale. Intente nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ValeContext.Provider
      value={{
        vale,
        updateVale,
        productos,
        addProducto,
        updateProductoCantidad,
        removeProducto,
        isLoading,
        setIsLoading,
        isSaving,
        setIsSaving,
        saveVale,
      }}
    >
      {children}
    </ValeContext.Provider>
  )
}

export const useValeContext = () => {
  const context = useContext(ValeContext)
  if (context === undefined) {
    throw new Error("useValeContext must be used within a ValeProvider")
  }
  return context
}
