"use client"
import { ValeProvider } from "@/context/vale-context"
import { Header } from "@/components/layout/header"
import { DatosValeForm } from "@/components/forms/datos-vale-form"
import { DatosAgricultorForm } from "@/components/forms/datos-agricultor-form"
import { DatosComercialForm } from "@/components/forms/datos-comercial-form"
import { DetalleGuia } from "@/components/products/detalle-guia"
import { ResumenFooter } from "@/components/layout/resumen-footer"

export function RegistroVales() {
  return (
    <ValeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-6 flex-grow">
          <div className="space-y-6">
            <DatosValeForm />
            <DatosAgricultorForm />
            <DatosComercialForm />
            {/* <ObservacionesForm /> */}
            <DetalleGuia />
          </div>
        </div>
        <ResumenFooter />
      </div>
    </ValeProvider>
  )
}
