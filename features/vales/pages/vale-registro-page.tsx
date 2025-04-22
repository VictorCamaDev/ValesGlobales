"use client"

import { ValeProvider } from "@/features/vales/context/vale-context"
import { ValeRegistroForm } from "@/features/vales/components/vale-registro-form"
import { AppHeader } from "@/components/layout/app-header"

export function ValeRegistroPage() {
  return (
    <ValeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppHeader title="REGISTRO DE VALES GLOBALES" />
        <main className="flex-grow">
          <ValeRegistroForm />
        </main>
      </div>
    </ValeProvider>
  )
}
