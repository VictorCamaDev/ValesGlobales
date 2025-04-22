export interface ValeDTO {
  numero: string
  idExpositor: string
  idExponente: string
  nombreAgricultor: string
  dni: string
  cultivo: string
  area: string
  longitudX: string
  latitudY: string
  codigoRTC: string
  nombreRTC: string
  lugarCanje: string
  idLugarCanje: string
  fechaEmision: string
  fechaVigencia: string
  observaciones: string
  celular?: string
  cultivoSecundario?: string
  areaSecundaria?: string
  codigoEmpresa: string
  // Campos adicionales
  tipoRegistro?: string // charla o referido
  tipoLecturaCoordenadas?: number // 0: manual, 1: automático
  tratamientoDatos?: boolean
  tiendasPreferencia?: string
}

export interface ValeRequestDTO {
  vale: ValeDTO
  productos: Array<{
    id: string
    nombre: string
    codigo: string
    cantidad: number
    precio: number
    descuento: number
  }>
  // Campos calculados
  totalItems?: number
  descuentoTotal?: number
}

export interface ValeResponseDTO {
  id: string
  numero: string
  fechaRegistro: string
  estado: string
  mensaje: string
}
