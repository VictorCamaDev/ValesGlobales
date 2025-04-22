import jsPDF from "jspdf"
import "jspdf-autotable"

// Necesitamos extender el tipo jsPDF para incluir autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// Plantilla original con QR
export const generarValePDF = ({
  empresaNombre,
  numeroVale,
  rtcDni,
  fecha,
  qrImgData,
}: {
  empresaNombre: string
  numeroVale: string
  rtcDni: string
  fecha: string
  qrImgData: string
}) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  })

  const pageWidth = 148
  const margin = 15

  // Colores
  const verde: [number, number, number] = [34, 139, 34]
  const grisClaro: [number, number, number] = [220, 220, 220]

  // Header
  pdf.setFillColor(...grisClaro)
  pdf.rect(0, 0, pageWidth, 25, "F") // fondo gris claro arriba

  pdf.setFontSize(14)
  pdf.setTextColor(...verde)
  pdf.setFont("helvetica", "bold")
  pdf.text("VALE DE DESCUENTO DIGITAL", pageWidth / 2, 17, { align: "center" })

  // Empresa y número
  pdf.setFontSize(10)
  pdf.setTextColor(40, 40, 40)
  pdf.setFont("helvetica", "normal")
  pdf.text(empresaNombre.toUpperCase(), margin, 35)

  pdf.setDrawColor(180, 180, 180)
  pdf.line(margin, 38, pageWidth - margin, 38)

  // Info RTC
  pdf.setFontSize(9)
  pdf.setTextColor(70, 70, 70)
  pdf.text("RTC - Registro de Vale Digital", margin, 46)
  pdf.setFont("helvetica", "bold")
  pdf.text(`DNI: ${rtcDni}`, margin, 52)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Fecha de emisión: ${fecha}`, margin, 58)

  // QR centrado
  const qrSize = 50
  const qrX = (pageWidth - qrSize) / 2
  pdf.addImage(qrImgData, "PNG", qrX, 75, qrSize, qrSize)

  // Pie
  pdf.setFontSize(7.5)
  pdf.setTextColor(100, 100, 100)
  pdf.text("Escanee este código QR para consultar este vale en línea.", pageWidth / 2, 135, { align: "center" })

  return pdf
}

// Nueva plantilla de vale completo (formato de la imagen compartida)
export const generarValeCompletoPDF = ({
  empresaNombre,
  numeroVale,
  cliente,
  dni,
  productos,
  descuentoTotal,
  rtcNombre,
  qrImgData,
}: {
  empresaNombre: string
  numeroVale: string
  cliente: string
  dni: string
  productos: any[]
  descuentoTotal: string | number
  rtcNombre: string
  qrImgData?: string
}) => {
  // Crear PDF
  const pdf = new jsPDF()

  // Título principal
  pdf.setFontSize(16)
  pdf.setTextColor(0, 0, 0) // Negro
  pdf.setFont("helvetica", "bold")
  pdf.text("VALE DE DESCUENTO GLOBAL", 105, 20, { align: "center" })

  // Empresa y número de vale
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text(`${empresaNombre}`, 20, 35)
  pdf.text(`${numeroVale}`, 190, 35, { align: "right" })

  // Información del cliente
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "bold")
  pdf.text(`Cliente: ${cliente}`, 20, 45)
  pdf.setFont("helvetica", "normal")
  pdf.text(`DNI: ${dni}`, 20, 50)

  // Tabla de productos
  if (productos && productos.length > 0) {
    pdf.autoTable({
      startY: 60,
      head: [["Producto", "Dsct x Uni.", "Cant. de Uni. Máx"]],
      body: productos.map((producto: any) => [
        producto.nombre,
        `S/ ${(producto.precio * producto.descuento).toFixed(2)}`,
        producto.cantidad,
      ]),
      theme: "grid",
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: "bold" },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 30, halign: "center" },
      },
      margin: { top: 60 },
    })
  }

  // Añadir descuento total
  const finalY = (pdf as any).lastAutoTable.finalY || 120
  pdf.setFont("helvetica", "bold")
  pdf.text(
    `DESCUENTO CLIENTE MAX: S/ ${typeof descuentoTotal === "string" ? Number.parseFloat(descuentoTotal).toFixed(2) : descuentoTotal.toFixed(2)}`,
    190,
    finalY + 10,
    {
      align: "right",
    },
  )

  // Añadir información del RTC
  pdf.setFont("helvetica", "bold")
  pdf.text(`RTC: ${rtcNombre}`, 20, finalY + 20)

  // Fechas
  const currentDate = new Date()
  const vigenciaDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)
  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`
  }

  pdf.setFont("helvetica", "normal")
  pdf.text(`FECHA: ${formatDate(currentDate)}`, 20, finalY + 30)
  pdf.text(`VIGENCIA CANJE: ${formatDate(vigenciaDate)}`, 20, finalY + 40)

  // Añadir QR code si se proporciona
  if (qrImgData) {
    pdf.addImage(qrImgData, "PNG", 75, finalY + 45, 60, 60)
  }

  return pdf
}
