import { API_ENDPOINTS } from "@/lib/config"

export async function generarPDFValeDesdeAPI(numeroVale: string): Promise<boolean> {
  try {
    // Llamar a la API para generar el PDF
    const response = await fetch(`${API_ENDPOINTS.GENERAR_PDF_VALE}/${numeroVale}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text(); // Capturamos el texto del error si la respuesta no es ok
      throw new Error(`Error al generar PDF: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
    }

    // Verificar que la respuesta es un PDF
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/pdf")) {
      const errorText = await response.text(); // Capturamos el cuerpo de la respuesta si no es PDF
      throw new Error(`Respuesta no es un PDF: ${contentType}. Detalles: ${errorText}`);
    }

    // Obtener el blob del PDF
    const pdfBlob = await response.blob()

    // Crear un objeto URL para el blob
    const pdfUrl = URL.createObjectURL(pdfBlob)

    // Crear un elemento <a> para descargar el PDF
    const downloadLink = document.createElement("a")
    downloadLink.href = pdfUrl
    downloadLink.download = `vale-${numeroVale}.pdf`

    // Añadir el elemento al DOM, hacer clic y luego eliminarlo
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    // Liberar el objeto URL
    URL.revokeObjectURL(pdfUrl)

    return true
  } catch (error) {
    console.error("Error al generar PDF desde API:", error)
    // Aquí puedes agregar más detalles en el catch si quieres un manejo más avanzado
    if (error instanceof Error) {
      alert(`Error al generar el PDF: ${error.message}`);
    }
    return false
  }
}
