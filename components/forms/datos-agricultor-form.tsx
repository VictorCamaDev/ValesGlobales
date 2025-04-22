"use client";

import type React from "react";

import { useValeContext } from "@/features/vales/context/vale-context";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { API_ENDPOINTS } from "@/lib/config";

export function DatosAgricultorForm() {
  const { vale, updateVale, isLoading } = useValeContext();
  const [showLatLong, setShowLatLong] = useState(false);
  const [selectedOption, setSelectedOption] = useState("charla");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [longitud, SetCordenatesX] = useState<string | null>(null);
  const [latitud, SetCordenatesY] = useState<string | null>(null);

  const handleSearchAgricultor = async (dni: string) => {
    if (dni.length >= 8) {
      try {
        setLoading(true);
        setError(null);
        SetCordenatesX(null);
        SetCordenatesY(null);

        const response = await fetch(API_ENDPOINTS.DNI_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_ENDPOINTS.DNI_API_TOKEN}`,
          },
          body: JSON.stringify({ dni }),
        });

        if (!response.ok) {
          throw new Error("No se encontró el agricultor");
        }

        const data = await response.json();

        updateVale({
          nombreAgricultor: `${data.data.nombres} ${data.data.apellido_paterno} ${data.data.apellido_materno}`,
        });
      } catch (error) {
        console.error("Error al buscar agricultor:", error);
        setError(
          "No se encontró información del DNI ingresado, complete manualmente."
        );
        updateVale({
          nombreAgricultor: "",
          celular: "",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleChange = () => {
    setShowLatLong(!showLatLong);

    if (!showLatLong) {
      // Si el toggle se activa, obtenemos la geolocalización
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            SetCordenatesY(position.coords.latitude.toString());
            SetCordenatesX(position.coords.longitude.toString());
            updateVale({
              latitudY: position.coords.latitude.toString(),
              longitudX: position.coords.longitude.toString(),
              tipoLecturaCoordenadas: 1, // Automático
            });
          },
          (error) => {
            console.error("Error de geolocalización:", error);
            setError("No se pudo obtener la ubicación.");
          }
        );
      } else {
        setError("Geolocalización no soportada en este navegador.");
      }
    } else {
      SetCordenatesY(null);
      SetCordenatesX(null);
      updateVale({
        latitudY: "",
        longitudX: "",
        tipoLecturaCoordenadas: 0, // Manual
      });
    }
  };

  // Actualizar el valor en el contexto cuando cambia la opción
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    updateVale({ tipoRegistro: value }); // Guardar en el contexto
  };

  return (
    <>
      {/* Loader que cubre toda la pantalla */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}
      <div className="space-y-0">
        <h2 className="section-header">DATOS DEL AGRICULTOR</h2>
        <div className="section-content">
          {error && (
            <div className="text-red-500 mb-4 text-sm">
              <p>{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label htmlFor="dni" className="form-label">
                DNI
              </label>
              <div className="relative">
                <input
                  id="dni"
                  type="text"
                  value={vale.dni}
                  onChange={(e) => {
                    updateVale({ dni: e.target.value });
                    handleSearchAgricultor(e.target.value);
                  }}
                  pattern="[0-9]"
                  minLength={8}
                  maxLength={8}
                  placeholder="Ingrese DNI para buscar"
                  className="form-input"
                  required
                />
                {isLoading === "agricultor" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nombreAgricultor" className="form-label">
                Nombre de Agricultor
              </label>
              <input
                id="nombreAgricultor"
                type="text"
                value={vale.nombreAgricultor}
                onChange={(e) => {
                  updateVale({ nombreAgricultor: e.target.value });
                  if (error) setError(null);
                }}
                placeholder="Nombre completo"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="celular" className="form-label">
                Celular
              </label>
              <input
                id="celular"
                type="text"
                value={vale.celular || ""}
                onChange={(e) => updateVale({ celular: e.target.value })}
                placeholder="Número de celular"
                className="form-input"
                maxLength={9}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="form-group">
              <label htmlFor="cultivo" className="form-label">
                Cultivo Principal
              </label>
              <input
                id="cultivo"
                type="text"
                value={vale.cultivo}
                onChange={(e) => updateVale({ cultivo: e.target.value })}
                placeholder="Tipo de cultivo"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="area" className="form-label">
                Área principal (Hectáreas)
              </label>
              <input
                id="area"
                type="number"
                value={vale.area}
                onChange={(e) => {
                  const newValue = Number.parseFloat(e.target.value);
                  if (newValue > 0 || e.target.value === "") {
                    updateVale({ area: e.target.value });
                  }
                }}
                placeholder="0.00"
                step="0.01"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cultivoSecundario" className="form-label">
                Cultivo Secundario
              </label>
              <input
                id="cultivoSecundario"
                type="text"
                value={vale.cultivoSecundario || ""}
                onChange={(e) =>
                  updateVale({ cultivoSecundario: e.target.value })
                }
                placeholder="Tipo de cultivo"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="areaSecundaria" className="form-label">
                Área Secundaria (Hectáreas)
              </label>
              <input
                id="areaSecundaria"
                type="number"
                value={vale.areaSecundaria || ""}
                onChange={(e) => {
                  const newValue = Number.parseFloat(e.target.value);
                  if (newValue > 0 || e.target.value === "") {
                    updateVale({ areaSecundaria: e.target.value });
                  }
                }}
                placeholder="0.00"
                step="0.01"
                className="form-input"
              />
            </div>
          </div>

          {/* Coordenadas */}
          <div className="form-group">
            <label className="form-label">Obtener Coordenadas?</label>
            <div className="relative inline-block w-11 h-5">
              <input
                id="toggle-lat-long"
                type="checkbox"
                checked={showLatLong}
                onChange={handleToggleChange}
                className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="toggle-lat-long"
                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
              ></label>
            </div>
          </div>

          {showLatLong && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="form-group">
                <label htmlFor="latitud" className="form-label">
                  Latitud
                </label>
                <input
                  id="latitud"
                  type="text"
                  value={vale.latitudY || ""}
                  onChange={(e) => updateVale({ latitudY: e.target.value })}
                  placeholder="Ingrese latitud"
                  readOnly
                  className="form-input"
                  required={showLatLong}
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitud" className="form-label">
                  Longitud
                </label>
                <input
                  id="longitud"
                  type="text"
                  value={vale.longitudX || ""}
                  onChange={(e) => updateVale({ longitudX: e.target.value })}
                  placeholder="Ingrese longitud"
                  className="form-input"
                  required={showLatLong}
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Opciones de selección */}
          <div className="form-group mt-4">
            <label className="form-label">Seleccionar opción</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="charla"
                name="opcion"
                value="charla"
                checked={selectedOption === "charla"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              <label htmlFor="charla" className="form-label mr-5">
                Charla
              </label>

              <input
                type="radio"
                id="referido"
                name="opcion"
                value="referido"
                checked={selectedOption === "referido"}
                onChange={handleOptionChange}
                className="mr-2"
              />
              <label htmlFor="referido" className="form-label">
                Referido
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
