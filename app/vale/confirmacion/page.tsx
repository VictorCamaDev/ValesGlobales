"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { generarPDFValeDesdeAPI } from "@/features/vales/services/pdf-service"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  // Obtener el número de vale de la URL
  const numero = searchParams.get("numero") || ""
  const cliente = searchParams.get("cliente") || "No disponible"
  const dni = searchParams.get("dni") || "No disponible"

  // Función para generar el PDF desde la API
  const generatePDFFromAPI = async () => {
    if (!numero) {
      toast.error("No se encontró el número de vale")
      return
    }

    setIsGeneratingPDF(true)
    try {
      await generarPDFValeDesdeAPI(numero)
      setPdfGenerated(true)
      toast.success("PDF generado correctamente")
    } catch (error) {
      console.error("Error al generar PDF:", error)
      toast.error("Error al generar el PDF. Intente nuevamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Generar PDF automáticamente al cargar la página
  useEffect(() => {
    if (!pdfGenerated && numero) {
      const timer = setTimeout(() => {
        generatePDFFromAPI()
      }, 1000) // Pequeño retraso para asegurar que la página esté completamente cargada

      return () => clearTimeout(timer)
    }
  }, [pdfGenerated, numero])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6 text-center">
      <CheckCircle2 className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">¡Vale registrado correctamente!</h1>
      <p className="text-lg text-gray-700 mb-6">
        El número de vale es: <span className="font-semibold">{numero}</span>
      </p>

      <div className="flex gap-4 flex-wrap justify-center mt-4">
        <Button onClick={generatePDFFromAPI} disabled={isGeneratingPDF} className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingPDF ? "Generando PDF..." : "Descargar PDF"}
        </Button>

        <Button onClick={() => router.push("/")} variant="outline">
          Ir al inicio
        </Button>

        <Button variant="outline" onClick={() => router.push("/vale/nuevo")}>
          Crear otro vale
        </Button>
      </div>

      {pdfGenerated && (
        <div className="mt-4 text-sm text-gray-500">
          El PDF del vale se ha descargado automáticamente. Si no se descargó, haga clic en el botón "Descargar PDF".
        </div>
      )}
    </div>
  )
}
