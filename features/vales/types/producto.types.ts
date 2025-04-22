export interface ProductoDTO {
  id: string
  codigo: string
  nombre: string
  precio: number
}

export interface ProductoValeDTO extends ProductoDTO {
  cantidad: number
  descuento: number
}
