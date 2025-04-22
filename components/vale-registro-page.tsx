"use client"

import { ValeProvider, useValeContext } from "@/features/vales/context/vale-context"
import { Header } from "@/components/ui/header"
import { DatosValeForm } from "@/components/forms/datos-vale-form"
import { DatosAgricultorForm } from "@/components/forms/datos-agricultor-form"
import { DatosComercialForm } from "@/components/forms/datos-comercial-form"
import { DetalleGuiaForm } from "@/components/forms/detalle-guia-form"
import { ObservacionesForm } from "@/components/forms/observaciones-form"
import { Footer } from "@/components/ui/footer"

export function ValeRegistroPage() {
  return (
    <ValeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="space-y-6">
            <DatosValeForm />
            <DatosAgricultorForm />
            <DatosComercialForm />
            <DetalleGuiaForm />
            <ObservacionesForm />
          </div>
        </main>

        <Footer />
      </div>
    </ValeProvider>
  )
}
