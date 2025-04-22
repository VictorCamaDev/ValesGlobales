"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, FileText } from "lucide-react"
import { RegistroValeModal } from "@/components/registro-vale-modal"
import { QrGeneratorModal } from "@/components/qr-generator-modal"

export function LandingPage() {
  const [showRegistroModal, setShowRegistroModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 flex flex-col">
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-emerald-700">Sistema de Vales Globales</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bienvenido al Sistema de Gestión de Vales
            </h2>
            <p className="text-lg text-gray-600">Seleccione una opción para continuar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setShowRegistroModal(true)}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="bg-emerald-100 p-4 rounded-full mb-6">
                  <FileText className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Registrar Vale</h3>
                <p className="text-gray-600">Cree un nuevo vale para agricultores con todos los datos necesarios.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setShowQrModal(true)}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="bg-emerald-100 p-4 rounded-full mb-6">
                  <QrCode className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Generar Código QR</h3>
                <p className="text-gray-600">Genere un código QR para acceder rápidamente al registro de vales.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Sistema de Vales Globales. Todos los derechos reservados.</p>
        </div>
      </footer>

      {showRegistroModal && <RegistroValeModal open={showRegistroModal} onOpenChange={setShowRegistroModal} />}
      {showQrModal && <QrGeneratorModal open={showQrModal} onOpenChange={setShowQrModal} />}
    </div>
  )
}
