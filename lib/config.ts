// Configuración centralizada para las URLs de API y otras variables de entorno

// URL base de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:44308/api"

// Endpoints específicos
export const API_ENDPOINTS = {
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
    process.env.NEXT_PUBLIC_DNI_API_TOKEN || "958d7d42025f7413026061009022e7997f6815ea495830a0b3bb556f423cb5e3",
}

// Otras configuraciones
export const APP_CONFIG = {
  VIGENCIA_VALE_DIAS: 30,
  DESCUENTO_DEFAULT: 0.00,
}
