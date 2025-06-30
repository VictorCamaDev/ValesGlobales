"use client";

import { useState } from "react";
import {
  ValeProvider,
  useValeContext,
} from "@/features/vales/context/vale-context";
import { ProductoCard } from "@/components/ui/producto-card";
import { ProductoAutocomplete } from "@/components/ui/producto-autocomplete";
import { getProductos } from "@/features/vales/services/producto-service";
import type { ProductoDTO } from "@/types/producto.types";

export function DetalleGuiaForm() {
  // Asegúrate de que el componente tenga acceso al vale
  const { productos, addProducto, isLoading, setIsLoading, vale } =
    useValeContext();
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [productosDisponibles, setProductosDisponibles] = useState<
    ProductoDTO[]
  >([]);
  const [productosYaCargados, setProductosYaCargados] = useState(false);

  // Modificar la función handleShowAutocomplete para usar idZona y nombreZona
  const handleShowAutocomplete = async () => {
    // Solo cargar productos si aún no se han cargado
    if (!productosYaCargados) {
      try {
        setIsLoading("productos");

        // Verificar que tenemos los datos de zona necesarios
        if (!vale.idLugarCanje || !vale.lugarCanje) {
          console.warn(
            "No hay información de zona disponible para cargar productos"
          );
          setIsLoading("");
          return;
        }

        const data = await getProductos(vale.idLugarCanje, vale.lugarCanje);
        // console.table(data)
        setProductosDisponibles(data);
        setProductosYaCargados(true);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setIsLoading("");
      }
    }
    setShowAutocomplete(true);
  };

  const handleAddProduct = (product: ProductoDTO) => {
    if (productos.length >= 8) return;
    addProducto(product);
    setShowAutocomplete(false);
  };

  return (
    <div className="space-y-0">
      <h2 className="section-header">
        LISTA DE PRODUCTOS (Máximo 8 productos)
      </h2>
      <div className="section-content">
        <div className="mb-6">
          {!showAutocomplete ? (
            <button
              onClick={handleShowAutocomplete}
              className="btn btn-primary"
              disabled={productos.length >= 8}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plus mr-2"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Añadir Producto
            </button>
          ) : (
            <ProductoAutocomplete
              productos={productosDisponibles}
              onSelect={handleAddProduct}
              onCancel={() => setShowAutocomplete(false)}
            />
          )}
          {productos.length >= 8 && (
            <p className="text-sm text-red-500 mt-5 bg-red-50 p-2 rounded-full text-center">
              Solo puede añadir hasta 8 productos.
            </p>
          )}
        </div>

        {isLoading === "productos" ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...productos].reverse().map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-package mx-auto text-gray-400 mb-4"
            >
              <path d="M16.5 9.4 7.55 4.24" />
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.29 7 12 12 20.71 7" />
              <line x1="12" x2="12" y1="22" y2="12" />
            </svg>
            <p className="text-gray-500">No hay productos agregados</p>
            <p className="text-sm text-gray-400 mt-1">
              Haga clic en "Añadir Producto" para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
