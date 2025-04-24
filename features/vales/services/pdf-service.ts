import { API_ENDPOINTS } from "@/lib/config"

export async function generarPDFValeDesdeAPI(numeroVale: string, idZona: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_ENDPOINTS.GENERAR_PDF_VALE}/${numeroVale}/${idZona}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error al generar PDF: ${response.status} ${response.statusText}. Detalles: ${errorText}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/pdf")) {
      const errorText = await response.text()
      throw new Error(`Respuesta no es un PDF: ${contentType}. Detalles: ${errorText}`)
    }

    const pdfBlob = await response.blob()

    const pdfUrl = URL.createObjectURL(pdfBlob)

    const downloadLink = document.createElement("a")
    downloadLink.href = pdfUrl
    downloadLink.download = `vale-${numeroVale}-${idZona}.pdf`

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    URL.revokeObjectURL(pdfUrl)

    return true
  } catch (error) {
    console.error("Error al generar PDF desde API:", error)
    if (error instanceof Error) {
      alert(`Error al generar el PDF: ${error.message}`)
    }
    return false
  }
}
