"use client"
import { ChartLine, Clock, Drop, Eye, EyeSlash, SquaresFour, Trash } from "@phosphor-icons/react"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import Header from "../components/Header"
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

export default function ParcelasEliminadas() {
  const [parcelasEliminadas, setParcelasEliminadas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedParcela, setSelectedParcela] = useState<any>(null)

  useEffect(() => {
    const apiParcelas = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/parcelas`)
        const api = response.data
        const parcelasNoDisponibles = api.filter((parcela: any) => parcela.disponible === false)
        setParcelasEliminadas(parcelasNoDisponibles)
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        setError("Error al cargar las parcelas eliminadas.")
        setLoading(false)
      }
    }
    apiParcelas()
  }, [])
  console.log(parcelasEliminadas);
  const handleParcelaClick = (parcela: any) => {
    setSelectedParcela(parcela === selectedParcela ? null : parcela)
  }
  return (
    <div className="bg-[#f6f8fb] rounded-xl shadow-md flex">
      <Sidebar>
        <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={'/'} />
        <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={false} alert={undefined} link={'/stats'} />
        <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={false} alert={undefined} link={"/historial"} />
        <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={true} alert={undefined} link={"/deleted"} />
        <SidebarItem icon={<Drop size={32} />} text={"Zona de Riegos"} active={false} alert={undefined} link={"/irrigation"} />
      </Sidebar>
      <div className="flex-1">
        <Header />
        <div className="flex items-center mb-6 p-6">
          <Trash size={24} className="text-red-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Historial de parcelas eliminadas</h2>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : parcelasEliminadas.length === 0 ? (
          <div className="text-gray-500 mx-6 text-center py-8 bg-gray-50 rounded-lg">
            <Trash size={48} className="text-gray-300 mx-auto mb-2" />
            <p>No hay parcelas eliminadas</p>
            <p className="text-sm mt-2">Cuando una parcela sea eliminada de la API, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="bg-white  py-3 px-6 mx-5 rounded-lg mb-10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-indigo-300 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Tipo de Cultivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parcelasEliminadas.map((parcela) => (
                    <tr key={parcela.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parcela.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.ubicacion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.responsable}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcela.tipo_cultivo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button onClick={() => handleParcelaClick(parcela)} className="text-indigo-400 hover:text-indigo-900 cursor-pointer">
                          {selectedParcela === parcela ? <EyeSlash size={25} /> : <Eye size={25}/>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedParcela && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-indigo-400">Detalles completos</h3>
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
                          {selectedParcela.datos.sensor.humedad}%
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

