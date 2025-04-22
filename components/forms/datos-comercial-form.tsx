"use client"

import { useValeContext } from "@/features/vales/context/vale-context"
import { useState, useEffect } from "react"
import { API_ENDPOINTS } from "@/lib/config"

export function DatosComercialForm() {
  const { vale, updateVale } = useValeContext()
  const [lugaresCanje, setLugaresCanje] = useState<{ id_zona: number; nombre: string }[]>([])

  useEffect(() => {
    // Establecer fechas por defecto
    const currentDate = new Date()
    const fechaVigencia = new Date(currentDate.valueOf() + 1000 * 60 * 60 * 24 * 30)

    updateVale({
      fechaEmision: currentDate.toISOString(),
      fechaVigencia: fechaVigencia.toISOString(),
    })

    if (typeof window === "undefined") return

    const urlParams = new URLSearchParams(window.location.search)
    const rtcDni = urlParams.get("rtc")
    const exponenteDni = urlParams.get("exponente")

    // Actualizar ID Exponente
    if (exponenteDni) {
      updateVale({ idExponente: exponenteDni })
    }

    // Si no hay RTC, no hacer nada
    if (!rtcDni) return

    // Llamada a la API para obtener los datos del RTC, si no se ha realizado ya
    const fetchRTCData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.OBTENER_USUARIO_RTC, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rtcDni),
        })

        const data = await response.json()

        if (data && data.length > 0) {
          const rtc = data[0]
          updateVale({
            idExpositor: rtcDni,
            nombreRTC: rtc.opcion,
            lugarCanje: rtc.nombre,
            codigoRTC: rtcDni,
            // Guardar los datos de zona
            idLugarCanje: rtc.iD_Zona || "",
          })
        }
      } catch (error) {
        console.error("Error al buscar RTC:", error)
      }
    }

    // Llamada a la API para obtener los datos del RTC, si no se ha realizado ya
    const fetchExpoData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.OBTENER_USUARIO_RTC, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exponenteDni),
        })

        const data = await response.json()

        if (data && data.length > 0) {
          const rtc = data[0]
          updateVale({
            nombreExponente: rtc.opcion,
          })
        }
      } catch (error) {
        console.error("Error al buscar RTC:", error)
      }
    }

    fetchRTCData()
    fetchExpoData()
  }, [])

  // Nuevo useEffect para cargar lugares de canje cuando nombreRTC está lleno
  useEffect(() => {
    const fetchLugares = async () => {
      if (!vale.nombreRTC) return

      try {
        const response = await fetch(API_ENDPOINTS.OBTENER_ZONAS_RTC, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()
        // console.log("Lugares recibidos:", data);
        if (Array.isArray(data)) {
          setLugaresCanje(data)
        }
      } catch (error) {
        console.error("Error al obtener lugares de canje:", error)
      }
    }

    fetchLugares()
  }, [vale.nombreRTC])

  return (
    <div className="space-y-0">
      <h2 className="section-header">COMERCIAL</h2>
      <div className="section-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label htmlFor="nombreRTC" className="form-label">
              Nombre de RTC
            </label>
            <input
              id="nombreRTC"
              type="text"
              value={vale.nombreRTC || ""}
              onChange={(e) => updateVale({ nombreRTC: e.target.value })}
              placeholder="Nombre del RTC"
              className="form-input"
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="lugarCanje" className="form-label">
              Lugar Canje
            </label>
            <select
              id="lugarCanje"
              value={vale.lugarCanje || ""}
              onChange={(e) => updateVale({ lugarCanje: e.target.value })}
              className="form-input pointer-events-none"
            >
              <option value="">Seleccionar lugar</option>
              {lugaresCanje.map((lugar) => (
                <option key={lugar.id_zona} value={lugar.nombre}>
                  {lugar.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nombreExponente" className="form-label">
              Nombre de Exponente
            </label>
            <input
              id="nombreExponente"
              type="text"
              value={vale.nombreExponente || ""}
              onChange={(e) => updateVale({ nombreExponente: e.target.value })}
              placeholder="Nombre del Exponente"
              className="form-input"
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaEmision" className="form-label">
              Fecha Emisión
            </label>
            <input
              id="fechaEmision"
              type="date"
              value={vale.fechaEmision?.split("T")[0] || ""}
              onChange={(e) =>
                updateVale({
                  fechaEmision: new Date(e.target.value).toISOString(),
                })
              }
              className="form-input"
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaVigencia" className="form-label">
              Fecha Vigencia
            </label>
            <input
              id="fechaVigencia"
              type="date"
              value={vale.fechaVigencia?.split("T")[0] || ""}
              onChange={(e) =>
                updateVale({
                  fechaVigencia: new Date(e.target.value).toISOString(),
                })
              }
              className="form-input"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  )
}
