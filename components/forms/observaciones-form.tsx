"use client"

import type React from "react"

import { useValeContext } from "@/features/vales/context/vale-context"
import { useState } from "react"

export function ObservacionesForm() {
  const { vale, updateVale } = useValeContext()
  const [autorizaDatos, setAutorizaDatos] = useState(false)

  const handleAutorizacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setAutorizaDatos(checked)
    updateVale({ tratamientoDatos: checked })
  }

  return (
    <div className="space-y-0">
      <h2 className="section-header">OBSERVACIONES</h2>
      <div className="section-content">

        <div className="form-group mt-4">
          <label className="form-label">Tratamiento de datos personales</label>
          <label className="flex items-center text-sm mr-5 form-label">
            <input
              type="checkbox"
              className="mr-2"
              checked={autorizaDatos}
              onChange={handleAutorizacionChange}
              required
            />
            Autorizo el tratamiento de mis datos personales para el envío de información que se crea necesaria
          </label>
        </div>
      </div>
    </div>
  )
}
