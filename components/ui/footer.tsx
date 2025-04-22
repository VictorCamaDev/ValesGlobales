"use client"

import { useValeContext } from "@/features/vales/context/vale-context"
import { calculateTotals } from "@/utils/calculations"

export function Footer() {
  let context
  try {
    context = useValeContext()
  } catch {
    context = null
  }

  if (!context) {
    // O mostrar un footer genérico si querés
    return (
      <footer className="bg-white border-t border-gray-200 py-4 px-6 shadow-md sticky bottom-0">
        <div className="text-center text-gray-400 text-sm">Pie de página</div>
      </footer>
    )
  }
  // console.log("Footer context:", context)
  const { productos, saveVale, isSaving } = context
  const { totalItems, subtotal } = calculateTotals(productos)

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 shadow-md sticky bottom-0">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <button className="btn btn-outline flex items-center gap-2">
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
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Atrás
            </button>
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={saveVale}
              disabled={isSaving || productos.length === 0}
            >
              {isSaving ? (
                <>Guardando...</>
              ) : (
                <>
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
                    className="lucide lucide-save"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Guardar Vale
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8">
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-500">Total de productos:</p>
              <p className="text-xl font-bold">{totalItems} items</p>
            </div>

            <div className="text-center sm:text-right">
              <div className="space-y-1">
                <div className="flex justify-between gap-4 font-bold">
                  <span className="text-green-600">Total Descuento:</span>
                  <span className="text-green-600">- S/ {subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
