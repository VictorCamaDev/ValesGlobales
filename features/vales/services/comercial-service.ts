// Actualizar la interfaz RTCDTO para incluir iD_Zona
interface RTCDTO {
  id: string
  codigo: string
  nombre: string
  iD_Zona?: string
}

export async function searchRTC(codigo: string): Promise<RTCDTO | null> {
  // Simulación de API - Reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (codigo === "7603") {
        resolve({
          id: "1",
          codigo: "7603",
          nombre: "CAMA ALBUQUERQUE, VICTOR MANUEL",
          iD_Zona: "105",
        })
      } else if (codigo === "8201") {
        resolve({
          id: "2",
          codigo: "8201",
          nombre: "RODRIGUEZ PEREZ, CARLOS",
          iD_Zona: "106",
        })
      } else {
        resolve(null)
      }
    }, 600)
  })
}

export async function getLugaresCanje(): Promise<string[]> {
  // Simulación de API - Reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["ALTOMAYO", "LIMA", "TRUJILLO", "CHICLAYO", "PIURA", "AREQUIPA"])
    }, 500)
  })
}
