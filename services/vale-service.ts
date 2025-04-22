import type { ValeRequestDTO, ValeResponseDTO } from "@/types/vale.types"

export async function saveValeService(data: ValeRequestDTO): Promise<ValeResponseDTO> {
  // Simulación de API - Reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
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
