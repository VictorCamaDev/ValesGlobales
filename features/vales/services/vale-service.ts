import type { ValeRequestDTO, ValeResponseDTO } from "@/features/vales/types/vale.types"

export async function saveVale(data: ValeRequestDTO): Promise<ValeResponseDTO> {
  // console.log("Saving vale with data:", JSON.stringify(data, null, 2))

  // Simulación de API - Reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      // console.log("Vale saved successfully (simulated)")
      resolve({
        id: "123456",
        numero: data.vale.numero,
        fechaRegistro: new Date().toISOString(),
        estado: "REGISTRADO",
        mensaje: "Vale registrado correctamente",
      })
    }, 1500)
  })
}

export async function getValeById(id: string): Promise<ValeResponseDTO> {
  // Simulación de API - Reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        numero: `VG-2023-${id}`,
        fechaRegistro: new Date().toISOString(),
        estado: "REGISTRADO",
        mensaje: "Vale encontrado",
      })
    }, 800)
  })
}
