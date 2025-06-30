
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Endpoints específicos
export const API_ENDPOINTS = {
  // Endpoints para obtencion de datos
  OBTENER_TECNICOS: `${API_BASE_URL}/Usuario/ObtenerTecnicos`,
  OBTENER_CULTIVOS: `${API_BASE_URL}/Usuario/ObtenerCultivos`,
  // Endpoints de usuario
  VALIDAR_RTC: `${API_BASE_URL}/Usuario/ValidarDocumentoRTC`,
  OBTENER_USUARIO_RTC: `${API_BASE_URL}/Usuario/ObtenerUsuarioRTC`,
  OBTENER_ZONAS_RTC: `${API_BASE_URL}/Usuario/ObtenerZonasRTC`,
  GUARDAR_VALE: `${API_BASE_URL}/Usuario/GuardarVale`,

  GENERAR_PDF_VALE: `${API_BASE_URL}/Usuario/GenerarPDFVale`,
  // Endpoints de productos
  OBTENER_PRODUCTOS: `${API_BASE_URL}/Usuario/ObtenerProductosRTC`,

  // Endpoints externos
  DNI_API: "https://apiperu.dev/api/dni",
  DNI_API_TOKEN:
    process.env.NEXT_PUBLIC_DNI_API_TOKEN,
}

// Otras configuraciones
export const APP_CONFIG = {
  VIGENCIA_VALE_DIAS: 30,
  DESCUENTO_DEFAULT: 0.00,
}