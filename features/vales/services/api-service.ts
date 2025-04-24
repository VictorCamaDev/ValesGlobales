// Servicio para validar RTC y otras operaciones con la API
import { API_ENDPOINTS } from "@/lib/config"

interface ValidateRTCResponse {
  isValid: boolean
  message: string
}

export async function ObtenerTecnicos() {
  const res = await fetch(API_ENDPOINTS.OBTENER_TECNICOS)
  if (!res.ok) throw new Error("No se pudieron obtener los tecnicos")
  return await res.json()
}

export async function obtenerCultivos() {
  const res = await fetch(API_ENDPOINTS.OBTENER_CULTIVOS);
  if (!res.ok) throw new Error("No se pudieron obtener los cultivos");
  return res.json();
}


export async function validateRTC(rtcDni: string): Promise<ValidateRTCResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.VALIDAR_RTC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rtcDni),
    })

    if (!response.ok) {
      throw new Error("Error en la validación del RTC")
    }

    const result = await response.json()

    if (Array.isArray(result) && result.length > 0) {
      return result[0] as ValidateRTCResponse
    } else {
      return {
        isValid: false,
        message: "Respuesta inválida del servidor",
      }
    }
  } catch (error: any) {
    console.error("Error validando RTC:", error)
    return {
      isValid: false,
      message: "No se pudo validar el RTC. Intente nuevamente.",
    }
  }
}

export async function validateExponente(EXponenteDni: string): Promise<ValidateRTCResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.VALIDAR_RTC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(EXponenteDni),
    })

    if (!response.ok) {
      throw new Error("Error en la validación del RTC")
    }

    const result = await response.json()

    if (Array.isArray(result) && result.length > 0) {
      return result[0] as ValidateRTCResponse
    } else {
      return {
        isValid: false,
        message: "Respuesta inválida del servidor",
      }
    }
  } catch (error: any) {
    console.error("Error validando RTC:", error)
    return {
      isValid: false,
      message: "No se pudo validar el RTC. Intente nuevamente.",
    }
  }
}

export async function saveValeData(valeData: any): Promise<{ success: boolean; valeNumber: string }> {
  console.log("Datos del vale a guardar:", JSON.stringify(valeData, null, 2))

  const spData = {
    NroValeDescuento: valeData.vale.numero,
    ID_Agenda: null, // Si no tienes este dato
    Cliente: valeData.vale.nombreAgricultor,
    NroDocumentoAgricultor: valeData.vale.dni,
    NombreAgricultor: valeData.vale.nombreAgricultor,
    Telefono: valeData.vale.celular,
    Codigo: valeData.vale.codigoRTC, // O el código que corresponda
    Cultivo: valeData.vale.cultivo,
    Area: valeData.vale.area,
    LogX: valeData.vale.longitudX,
    LatY: valeData.vale.latitudY,
    TipoLecturaCoordenadas: valeData.vale.tipoLecturaCoordenadas || 0,
    DescuentoTotalRegistrado: valeData.descuentoTotal,
    Rtc: valeData.vale.codigoRTC,
    RtcNombre: valeData.vale.nombreRTC,
    Fecha: new Date(valeData.vale.fechaEmision).toISOString().split("T")[0],
    FechaVigencia: new Date(valeData.vale.fechaVigencia).toISOString().split("T")[0],
    ID_Zona: Number.parseInt(valeData.vale.idLugarCanje) || 1,
    CanjearEn: valeData.vale.lugarCanje,
    TiendasPreferencia: valeData.vale.tiendasPreferencia || "",
    Observaciones: valeData.vale.observaciones,
    NroItems: valeData.totalItems,
    UsuarioModificacion: valeData.vale.idExponente,
    Accion: valeData.vale.tipoRegistro || "charla",
    EnTienda: 1,
    UsuarioCreacion: valeData.vale.idExponente,
    FechaHoraCreacion: new Date().toISOString(),
    Productos: valeData.productos.map((p: any) => ({
      ID: p.id,
      Nombre: p.nombre,
      Codigo: p.codigo,
      CantidadRegistrada: p.cantidad,
      CantidadAplicada: 0,
      ValorDescuentoUnitario: p.precio * p.descuento,
    })),
  }

  console.log("Datos formateados para SP:", JSON.stringify(spData, null, 2))

  try {
    const response = await fetch(API_ENDPOINTS.GUARDAR_VALE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Agrega otros headers si es necesario, como Authorization
      },
      body: JSON.stringify(valeData),
    })

    if (!response.ok) {
      throw new Error(`Error al guardar vale: ${response.statusText}`)
    }

    const result = await response.json()

    return {
      success: true,
      valeNumber: result.valeNumber || "Desconocido",
    }
  } catch (error) {
    console.error("Error al guardar el vale:", error)
    return {
      success: false,
      valeNumber: "",
    }
  }
}
