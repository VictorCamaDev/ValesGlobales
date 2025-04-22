import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner" // 👈 Importa Toaster
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Registro de Vales Globales",
  description: "Sistema de registro de vales para agricultores",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  )
}

import "./globals.css"


import './globals.css'