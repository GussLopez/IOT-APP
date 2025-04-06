"use client"

import { useEffect, useState } from "react"
import { SquaresFour, ChartLine, Clock, Trash, Drop } from "@phosphor-icons/react"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Spinner from "../components/Spinner"

export default function HistorialView() {
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSensor, setSelectedSensor] = useState("humedad")

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:4000/api/sensores")
        setHistoricalData(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error getting the data:", error)
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [])

  const prepareTimelineData = () => {
    if (!historicalData || historicalData.length === 0) return []

    return historicalData.map((record) => ({
      fecha: new Date(record.createdAt).toLocaleString(),
      humedad: record.humedad,
      temperatura: record.temperatura,
      lluvia: record.lluvia,
      sol: record.sol,
    }))
  }

  return (
    <>
      <main className="bg-[#f6f8fb] min-h-screen flex relative">
        <Sidebar>
          <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={"/"} />
          <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={false} alert={undefined} link={"/stats"} />
          <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={true} alert={undefined} link={"/historial"} />
          <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={false} alert={undefined} link={"/deleted"} />
          <SidebarItem icon={<Drop size={32} />} text={"Riegos"} active={false} alert={undefined} link={"/irrigation"} />
        </Sidebar>
        <div className="flex-1">
          <Header />

          {loading ? (
            <div className="p-[200px]">
              <Spinner />
            </div>
          ) : (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Historial de Sensores</h1>

              <div className="mb-6">
                <div className="bg-white p-4 rounded-xl">
                  <div className="flex flex-wrap gap-4 mb-4 font-semibold">
                    <button
                      onClick={() => setSelectedSensor("humidity")}
                      className={`px-4 py-2 rounded-lg ${selectedSensor === "humidity" ? "bg-blue-600 text-white" : "bg-gray-200 cursor-pointer"
                        }`}
                    >
                      Humedad
                    </button>
                    <button
                      onClick={() => setSelectedSensor("temperature")}
                      className={`px-4 py-2 rounded-lg ${selectedSensor === "temperature" ? "bg-red-600 text-white" : "bg-gray-200 cursor-pointer"
                        }`}
                    >
                      Temperatura
                    </button>
                    <button
                      onClick={() => setSelectedSensor("rain")}
                      className={`px-4 py-2 rounded-lg ${selectedSensor === "rain" ? "bg-green-600 text-white" : "bg-gray-200 cursor-pointer"
                        }`}
                    >
                      Lluvia
                    </button>
                    <button
                      onClick={() => setSelectedSensor("sun")}
                      className={`px-4 py-2 rounded-lg ${selectedSensor === "sun" ? "bg-yellow-600 text-white" : "bg-gray-200 cursor-pointer"
                        }`}
                    >
                      Sol
                    </button>
                  </div>

                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareTimelineData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedSensor === "humedad" && (
                          <Line
                            type="monotone"
                            dataKey="humedad"
                            stroke="#8884d8"
                            name="Humedad (%)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        )}
                        {selectedSensor === "temperatura" && (
                          <Line
                            type="monotone"
                            dataKey="temperatura"
                            stroke="#ff8042"
                            name="Temperatura (°C)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        )}
                        {selectedSensor === "lluvia" && (
                          <Line
                            type="monotone"
                            dataKey="lluvia"
                            stroke="#82ca9d"
                            name="Lluvia (mm)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        )}
                        {selectedSensor === "sol" && (
                          <Line
                            type="monotone"
                            dataKey="sol"
                            stroke="#ffc658"
                            name="Sol (%)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">Registros</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Humedad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Temperatura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lluvia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sol
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historicalData.map((record, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.humedad}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.temperatura}°C</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.lluvia} mm</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.sol}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

