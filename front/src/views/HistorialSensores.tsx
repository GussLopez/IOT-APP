"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router-dom"

export default function HistorialSensores() {
  const [sensorData, setSensorData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState("humedad")
  const navigate = useNavigate()
  const token = localStorage.getItem('AUTH_TOKEN')

  if (!token) {
    navigate('/auth/token')
  }

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get("http://localhost:4000/api/sensores")

        // Ordenamos los datos por fecha de creación
        const sortedData = response.data.sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )

        setSensorData(sortedData)
        setLoading(false)
      } catch (err) {
        console.error("Error al obtener datos de sensores:", err)
        setError("Error al cargar los datos. Por favor, intenta de nuevo más tarde.")
        setLoading(false)
      }
    }

    fetchSensorData()
  }, [])

  const prepareChartData = () => {
    return sensorData.map((sensor) => ({
      fecha: sensor.createdAt.slice(11, 12),
      humedad: sensor.humedad,
      temperatura: sensor.temperatura,
      lluvia: sensor.lluvia,
      sol: sensor.sol,
    }))
  }

  const metricColors = {
    humedad: "#8884d8",
    temperatura: "#ff8042",
    lluvia: "#82ca9d",
    sol: "#ffc658",
  }

  const metricNames = {
    humedad: "Humedad (%)",
    temperatura: "Temperatura (°C)",
    lluvia: "Lluvia (mm)",
    sol: "Sol (%)",
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Historial de Sensores</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : sensorData.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No hay datos históricos disponibles. Guarda algunos datos primero.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(metricNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedMetric === key
                    ? `bg-${key === "humedad" ? "blue" : key === "temperatura" ? "red" : key === "lluvia" ? "green" : "yellow"}-500 text-white`
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metricColors[selectedMetric as keyof typeof metricColors]}
                  name={metricNames[selectedMetric as keyof typeof metricNames]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Últimos registros</h3>
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
                  {sensorData.slice(-5).map((sensor, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sensor.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.humedad}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.temperatura}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.lluvia} mm</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sensor.sol}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

