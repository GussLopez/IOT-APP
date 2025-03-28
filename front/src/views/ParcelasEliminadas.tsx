"use client"

import { useEffect, useState } from "react"
import { getDeletedParcelasHistory } from "../services/dataService"
import { ChartLine, Clock, MapPinArea, SquaresFour, Trash } from "@phosphor-icons/react"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import Header from "../components/Header"

export default function ParcelasEliminadas() {
  const [parcelasEliminadas, setParcelasEliminadas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedParcela, setSelectedParcela] = useState<any>(null)

  useEffect(() => {
    const fetchDeletedParcelas = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getDeletedParcelasHistory()
        setParcelasEliminadas(data)
        setLoading(false)
      } catch (err) {
        console.error("Error al obtener parcelas eliminadas:", err)
        setError("Error al cargar el historial de parcelas eliminadas.")
        setLoading(false)
      }
    }

    fetchDeletedParcelas()
  }, [])

  const handleParcelaClick = (parcela: any) => {
    setSelectedParcela(parcela === selectedParcela ? null : parcela)
  }

  return (
    <div className="bg-white rounded-xl shadow-md flex">
      <Sidebar>
        <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={'/'} />
        <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={false} alert={undefined} link={'/stats'} />
        <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={false} alert={undefined} link={"/historial"} />
        <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={true} alert={undefined} link={"/deleted"} />
        <SidebarItem icon={<MapPinArea size={32} />} text={"Locations"} active={false} alert={undefined} link={"/locations"} />
      </Sidebar>
      <div className="flex-1">
        <Header />
        <div className="flex items-center mb-6 p-6">
          <Trash size={24} className="text-red-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Historial de Parcelas Eliminadas</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : parcelasEliminadas.length === 0 ? (
          <div className="text-gray-500 mx-6 text-center py-8 bg-gray-50 rounded-lg">
            <Trash size={48} className="text-gray-300 mx-auto mb-2" />
            <p>No hay registros de parcelas eliminadas.</p>
            <p className="text-sm mt-2">Cuando una parcela sea eliminada de la API, aparecerá aquí.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Cultivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Eliminación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parcelasEliminadas.map((parcela) => (
                    <tr key={parcela.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.parcelaId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parcela.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.ubicacion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.responsable}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.tipo_cultivo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(parcela.fecha_eliminacion).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button onClick={() => handleParcelaClick(parcela)} className="text-blue-600 hover:text-blue-800">
                          {selectedParcela === parcela ? "Ocultar detalles" : "Ver detalles"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedParcela && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Detalles completos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Información de la parcela</h4>
                    <dl className="grid grid-cols-3 gap-2">
                      <dt className="text-sm font-medium text-gray-500">ID:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{selectedParcela.parcelaId}</dd>

                      <dt className="text-sm font-medium text-gray-500">Nombre:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{selectedParcela.nombre}</dd>

                      <dt className="text-sm font-medium text-gray-500">Ubicación:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{selectedParcela.ubicacion}</dd>

                      <dt className="text-sm font-medium text-gray-500">Responsable:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{selectedParcela.responsable}</dd>

                      <dt className="text-sm font-medium text-gray-500">Tipo de cultivo:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{selectedParcela.tipo_cultivo}</dd>

                      <dt className="text-sm font-medium text-gray-500">Eliminada el:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {new Date(selectedParcela.fecha_eliminacion).toLocaleString()}
                      </dd>
                    </dl>
                  </div>

                  {selectedParcela.datos_completos && selectedParcela.datos_completos.sensor && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Últimos datos de sensores</h4>
                      <dl className="grid grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Humedad:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedParcela.datos_completos.sensor.humedad}%
                        </dd>

                        <dt className="text-sm font-medium text-gray-500">Temperatura:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedParcela.datos_completos.sensor.temperatura}°C
                        </dd>

                        <dt className="text-sm font-medium text-gray-500">Lluvia:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedParcela.datos_completos.sensor.lluvia} mm
                        </dd>

                        <dt className="text-sm font-medium text-gray-500">Sol:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedParcela.datos_completos.sensor.sol}%
                        </dd>

                        <dt className="text-sm font-medium text-gray-500">Último riego:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {selectedParcela.datos_completos.ultimo_riego}
                        </dd>
                      </dl>
                    </div>
                  )}
                </div>

                {selectedParcela.datos_completos && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Coordenadas</h4>
                    <dl className="grid grid-cols-6 gap-2">
                      <dt className="text-sm font-medium text-gray-500">Latitud:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{selectedParcela.datos_completos.latitud}</dd>

                      <dt className="text-sm font-medium text-gray-500">Longitud:</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{selectedParcela.datos_completos.longitud}</dd>
                    </dl>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

