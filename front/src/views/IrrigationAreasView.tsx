"use client"

import { useEffect, useState } from "react"
import { SquaresFour, ChartLine, Clock, Trash, Drop, Warning } from "@phosphor-icons/react"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import axios from "axios"
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface IrrigationZone {
  id: number
  sector: string
  nombre: string
  tipo_riego: string
  estado: string
  latitud: number
  longitud: number
  motivo: string
  fecha: string
  color: string
}

function MapController({ zones }: { zones: IrrigationZone[] }) {
  const map = useMap()

  useEffect(() => {
    if (zones.length === 0) return

    const validZones = zones.filter(
      (zone) =>
        typeof zone.latitud === "number" &&
        typeof zone.longitud === "number" &&
        !isNaN(zone.latitud) &&
        !isNaN(zone.longitud),
    )

    if (validZones.length === 0) return

    const bounds = validZones.map((zone) => [zone.latitud, zone.longitud])
    map.fitBounds(bounds as any)
  }, [zones, map])

  return null
}

export default function IrrigationAreasView() {
  const [zones, setZones] = useState<IrrigationZone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<IrrigationZone | null>(null)

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://moriahmkt.com/iotapp/am/")
        if (response.data && response.data.zonas) {
          setZones(response.data.zonas)
        } else {
          setError("No se encontraron datos de zonas de riego")
        }
        setLoading(false)
      } catch (error) {
        console.error("Error al obtener datos de zonas:", error)
        setError("Error al cargar los datos de zonas de riego")
        setLoading(false)
      }
    }

    fetchZones()
  }, [])

  const nonFunctionalStates = [
    "mantenimiento",
    "descompuesto",
    "fuera_de_servicio",
  ]

  const nonFunctionalZones = zones.filter((zone) => {
    const lowerCaseState = zone.estado.toLowerCase()
    return nonFunctionalStates.some((state) => lowerCaseState.includes(state))
  })

  const prepareStatusData = () => {
    const statusCount: Record<string, number> = {}

    zones.forEach((zone) => {
      const normalizedStatus = zone.estado.toLowerCase()
      statusCount[normalizedStatus] = (statusCount[normalizedStatus] || 0) + 1
    })

    return Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " "), 
      value,
    }))
  }

  const statusColors = ["#4f46e5", "#65a30d", "#f97316", "#ff8042", "#0088FE", "#00C49F"]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getMapCenter = () => {
    if (zones.length === 0) return [21.047, -86.848]

    // Filtrar zonas con coordenadas válidas
    const validZones = zones.filter(
      (zone) =>
        typeof zone.latitud === "number" &&
        typeof zone.longitud === "number" &&
        !isNaN(zone.latitud) &&
        !isNaN(zone.longitud),
    )

    if (validZones.length === 0) return [21.047, -86.848]

    const sumLat = validZones.reduce((sum, zone) => sum + zone.latitud, 0)
    const sumLng = validZones.reduce((sum, zone) => sum + zone.longitud, 0)

    return [sumLat / validZones.length, sumLng / validZones.length]
  }

  const getStatusBgColor = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("mantenimiento")) return "bg-yellow-100 text-yellow-800"
    if (lowerStatus.includes("fuera_de_servicio")) return "bg-purple-100 text-purple-800"
    if (lowerStatus.includes("apagado")) return "bg-gray-100 text-gray-800"
    return "bg-red-100 text-red-800"
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ")
  }

  return (
    <>
      <main className="bg-[#f6f8fb] min-h-screen flex relative">
        <Sidebar>
          <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={"/"} />
          <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={false} alert={undefined} link={"/stats"} />
          <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={false} alert={undefined} link={"/historial"} />
          <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={false} alert={undefined} link={"/deleted"} />
          <SidebarItem icon={<Drop size={32} />} text={"Zona de Riegos"} active={true} alert={undefined} link={"/irrigation"} />
        </Sidebar>
        <div className="flex-1">
          <Header />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div className="p-6">
              <div className="flex items-center mb-6 gap-5">
                <h1 className="text-2xl font-bold text-gray-800">Zonas de Riego</h1>
                <Drop size={30} color="#818cf8"/>
              </div>

              {/* Mapa de zonas de riego */}
              <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Mapa de Zonas</h2>
                <div className="h-[500px] rounded-lg overflow-hidden">
                  {zones.length > 0 ? (
                    <MapContainer
                      center={[21.047, -86.848]}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapController zones={zones} />
                      {zones.map((zone) => {
                        if (!zone.latitud || !zone.longitud) return null

                        return (
                          <CircleMarker
                            key={zone.id}
                            center={[zone.latitud, zone.longitud]}
                            radius={10}
                            pathOptions={{
                              color: zone.color || "#3388ff",
                              fillColor: zone.color || "#3388ff",
                              fillOpacity: 0.7,
                            }}
                            eventHandlers={{
                              click: () => {
                                setSelectedZone(zone)
                              },
                            }}
                          >
                            <Popup>
                              <div className="p-2">
                                <h3 className="font-bold text-lg">{zone.nombre}</h3>
                                <p>
                                  <span className="font-semibold">Sector:</span> {zone.sector}
                                </p>
                                <p>
                                  <span className="font-semibold">Tipo de riego:</span> {zone.tipo_riego}
                                </p>
                                <p>
                                  <span className="font-semibold">Estado:</span>
                                  <span
                                    className={`ml-1 ${zone.estado.toLowerCase() === "activo"
                                        ? "text-green-600"
                                        : zone.estado.toLowerCase() === "mantenimiento"
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                  >
                                    {formatStatus(zone.estado)}
                                  </span>
                                </p>
                                {zone.estado.toLowerCase() !== "activo" && (
                                  <p>
                                    <span className="font-semibold">Motivo:</span> {zone.motivo}
                                  </p>
                                )}
                                <p>
                                  <span className="font-semibold">Fecha:</span> {formatDate(zone.fecha)}
                                </p>
                              </div>
                            </Popup>
                          </CircleMarker>
                        )
                      })}
                    </MapContainer>
                  ) : (
                    <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                      <p className="text-gray-500">No hay datos de zonas disponibles para mostrar en el mapa</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de zonas no funcionales */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <div className="flex items-center mb-4">
                    <Warning size={24} className="text-yellow-500 mr-2" />
                    <h2 className="text-lg font-semibold">Zonas No Funcionales</h2>
                  </div>

                  {nonFunctionalZones.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Todas las zonas están funcionando correctamente</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Zona
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Motivo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Desde
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {nonFunctionalZones.map((zone) => (
                            <tr
                              key={zone.id}
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedZone(zone)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: zone.color }}
                                  ></div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{zone.nombre}</div>
                                    <div className="text-sm text-gray-500">{zone.sector}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBgColor(zone.estado)}`}
                                >
                                  {formatStatus(zone.estado)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.motivo}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(zone.fecha)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Gráfico de distribución por estados */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">Distribución por Estados</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} zonas`, name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detalles de la zona seleccionada */}
              {selectedZone && (
                <div className="mt-6 bg-white p-4 rounded-xl shadow">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: selectedZone.color }}></div>
                      <h2 className="text-lg font-semibold">Detalles de Zona: {selectedZone.nombre}</h2>
                    </div>
                    <button onClick={() => setSelectedZone(null)} className="text-gray-500 hover:text-gray-700">
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Información General</h3>
                      <dl className="grid grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">ID:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{selectedZone.id}</dd>

                        <dt className="text-sm font-medium text-gray-500">Sector:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{selectedZone.sector}</dd>

                        <dt className="text-sm font-medium text-gray-500">Nombre:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{selectedZone.nombre}</dd>

                        <dt className="text-sm font-medium text-gray-500">Tipo de riego:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{selectedZone.tipo_riego}</dd>
                      </dl>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Estado y Ubicación</h3>
                      <dl className="grid grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                        <dd
                          className={`text-sm col-span-2 ${selectedZone.estado.toLowerCase() === "activo"
                              ? "text-green-600"
                              : selectedZone.estado.toLowerCase() === "mantenimiento"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                        >
                          {formatStatus(selectedZone.estado)}
                        </dd>

                        {selectedZone.estado.toLowerCase() !== "activo" && (
                          <>
                            <dt className="text-sm font-medium text-gray-500">Motivo:</dt>
                            <dd className="text-sm text-gray-900 col-span-2">{selectedZone.motivo}</dd>
                          </>
                        )}

                        <dt className="text-sm font-medium text-gray-500">Fecha:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formatDate(selectedZone.fecha)}</dd>

                        <dt className="text-sm font-medium text-gray-500">Latitud:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{selectedZone.latitud}</dd>

                        <dt className="text-sm font-medium text-gray-500">Longitud:</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{selectedZone.longitud}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
