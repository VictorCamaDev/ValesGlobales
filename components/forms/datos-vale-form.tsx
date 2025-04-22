"use client";

import {
  ValeProvider,
  useValeContext,
} from "@/features/vales/context/vale-context";
import { useState, useEffect } from "react";

export function DatosValeForm() {
  const { vale, updateVale } = useValeContext();
  const [isFromUrl, setIsFromUrl] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const rtcParam = urlParams.get("rtc");
      const expoParam = urlParams.get("expo");
      const empresaParam = urlParams.get("empresa");

      const empresas: Record<string, string> = {
        "1": "Silvestre",
        "2": "Neoagrum",
      };

      const nombreEmpresa = empresaParam
        ? empresas[empresaParam] ?? empresaParam
        : "";

      if (rtcParam || expoParam) {
        setIsFromUrl(true);

        updateVale({
          idExpositor: rtcParam ?? "",
          idExponente: expoParam ?? "",
          codigoEmpresa: nombreEmpresa ?? "",
        });
      }
    }
  }, []);

  return (
    <div className="space-y-0">
      <h2 className="section-header">DATOS DEL VALE</h2>
      <div className="section-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="form-group">
            <label htmlFor="codigoEmpresa" className="form-label">
              Empresa
            </label>
            <input
              id="codigoEmpresa"
              type="text"
              value={vale.codigoEmpresa}
              readOnly
              className="form-input bg-gray-50"
            />
          </div>
          <div className="form-group">
            <label htmlFor="numero" className="form-label">
              Número
            </label>
            <input
              id="numero"
              type="text"
              value={vale.numero || ""}
              onChange={(e) => updateVale({ numero: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="idExpositor" className="form-label">
              ID Expositor (RTC)
            </label>
            <input
              id="idExpositor"
              type="text"
              value={vale.idExpositor}
              readOnly
              className="form-input bg-gray-50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="idExponente" className="form-label">
              ID Exponente
            </label>
            <input
              id="idExponente"
              type="text"
              value={vale.idExponente}
              readOnly
              className="form-input bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
