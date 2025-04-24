"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { ValeDTO } from "@/features/vales/types/vale.types"
import type { ProductoDTO, ProductoValeDTO } from "@/features/vales/types/producto.types"
import { toast } from "sonner"
import { saveValeData } from "../services/api-service"

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
  const searchParams = useSearchParams()

  // Obtener parámetros de la URL
  const empresaParam = searchParams.get("empresa")
  const rtcParam = searchParams.get("rtc")
  const exponenteParam = searchParams.get("exponente")
  const numeroParam = searchParams.get("numero")

  const [vale, setVale] = useState<ValeDTO>({
    numero: numeroParam || "",
    idExpositor: rtcParam || "",
    idExponente: exponenteParam || "",
    nombreAgricultor: "",
    dni: "",
    cultivo: "",
    area: "",
    longitudX: "",
    latitudY: "",
    codigoRTC: rtcParam || "",
    nombreRTC: "",
    nombreExponente: "",
    lugarCanje: "",
    idLugarCanje: "",
    fechaEmision: new Date().toISOString(),
    fechaVigencia: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: "",
    celular: "",
    cultivoSecundario: "",
    areaSecundaria: "",
    codigoEmpresa: empresaParam || "",
    tipoRegistro: "",
    tipoLecturaCoordenadas: 1,
    tratamientoDatos: false
  })

  const [productos, setProductos] = useState<ProductoValeDTO[]>([])
  const [isLoading, setIsLoading] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const updateVale = (data: Partial<ValeDTO>) => {
    setVale((prev) => ({ ...prev, ...data }))
  }

  const addProducto = (producto: ProductoDTO) => {
    const existingProductIndex = productos.findIndex((p) => p.id === producto.id);
  
    if (existingProductIndex >= 0) {
      const updatedProductos = [...productos];
      const currentCantidad = updatedProductos[existingProductIndex].cantidad;
  
      if (currentCantidad >= 12) {
        toast.error("No puedes agregar más de 12 unidades de este producto.");
        return;
      }
  
      updatedProductos[existingProductIndex].cantidad = currentCantidad + 1;
      setProductos(updatedProductos);
    } else {
      if (productos.length >= 4) {
        toast.error("Solo puedes añadir hasta 4 productos distintos.");
        return;
      }
  
      setProductos([
        ...productos,
        {
          ...producto,
          cantidad: 1,
          descuento: producto.precio,
        },
      ]);
    }
  };
  

  const updateProductoCantidad = (id: string, cantidad: number) => {
    setProductos(productos.map((producto) => (producto.id === id ? { ...producto, cantidad } : producto)))
  }

  const removeProducto = (id: string) => {
    setProductos(productos.filter((producto) => producto.id !== id))
  }

  // Modificar la función saveVale para incluir todos los campos necesarios
  const saveVale = async () => {
    if (productos.length === 0) {
      toast.warning("Debe agregar al menos un producto al vale")
      return
    }

    // Validar campos obligatorios
    const camposObligatorios = [
      { campo: "dni", nombre: "DNI del agricultor" },
      { campo: "nombreAgricultor", nombre: "Nombre del agricultor" },
      { campo: "celular", nombre: "Celular" },
      { campo: "cultivo", nombre: "Cultivo principal" },
      { campo: "area", nombre: "Área principal" },
      { campo: "lugarCanje", nombre: "Lugar de canje" },
    ]

    for (const campo of camposObligatorios) {
      if (!vale[campo.campo as keyof ValeDTO]) {
        toast.error(`El campo ${campo.nombre} es obligatorio`)
        return
      }
    }

    // Validar autorización de datos personales
    if (!vale.tratamientoDatos) {
      toast.error("Debe autorizar el tratamiento de datos personales")
      return
    }

    try {
      setIsSaving(true)
      toast.info("Guardando vale...")

      // Calcular totales
      const totalItems = productos.reduce((sum, p) => sum + p.cantidad, 0)
      const descuentoTotal = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0)

      // Preparar los datos completos para guardar y mostrar en consola
      const valeData = {
        vale: {
          ...vale,
          fechaEmision: new Date(vale.fechaEmision).toISOString(),
          fechaVigencia: new Date(vale.fechaVigencia).toISOString(),
          tipoRegistro: vale.tipoRegistro || "charla",
          tipoLecturaCoordenadas: vale.tipoLecturaCoordenadas || 0,
          tratamientoDatos: vale.tratamientoDatos || false,
        },
        productos: productos.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          codigo: p.codigo,
          cantidadRegistrada: p.cantidad,
          CantidadAplicada: p.cantidad,
          ValorDescuentoUnitario: p.precio * p.cantidad,
        })),
        totalItems,
        descuentoTotal,
      }

      // Imprimir en consola todos los datos
      console.log("DATOS COMPLETOS DEL VALE A GUARDAR:", JSON.stringify(valeData, null, 2))

      // Guardar los datos
      const result = await saveValeData(valeData)

      if (result.success) {
        toast.success(`Vale guardado correctamente: ${result.valeNumber}`)

        // Preparar los productos para la URL
        const productosParam = encodeURIComponent(JSON.stringify(productos))

        // Redirigir a la página de confirmación con todos los datos necesarios
        router.push(
          `/vale/confirmacion?numero=${result.valeNumber}&empresa=${vale.idLugarCanje}&rtc=${vale.codigoRTC}&rtcNombre=${encodeURIComponent(vale.nombreRTC)}&cliente=${encodeURIComponent(vale.nombreAgricultor)}&dni=${vale.dni}&productos=${productosParam}&descuentoTotal=${descuentoTotal}&totalItems=${totalItems}`,
        )
      } else {
        toast.error("No se pudo guardar el vale. Intente nuevamente.")
      }
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
