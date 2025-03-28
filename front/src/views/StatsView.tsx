"use client"

import { useEffect, useState } from "react"
import { SquaresFour, ChartLine, MapPinArea, Clock, Trash } from "@phosphor-icons/react"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import axios from "axios"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { saveAllApiData } from "../services/dataService"

export default function StatsView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [savingData, setSavingData] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null)

  const timeOut = 10000 * 6
  const fetchData = async () => {
    try {
      setLoading((prevLoading) => {
        return prevLoading && !data
      })
      const response = await axios.get("https://moriahmkt.com/iotapp/updated/")
      setData(response.data)
      setLastUpdated(new Date())
      setLoading(false)

      setTimeout(() => {
        saveDataToDatabase()
      }, timeOut);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const saveDataToDatabase = async () => {
    try {
      setSavingData(true)
      console.log("Iniciando guardado de datos desde StatsView...")
      const result = await saveAllApiData()
      console.log("Resultado del guardado:", result)
      setSaveStatus(result)

      setTimeout(() => {
        setSaveStatus(null)
      }, 3000)
    } catch (error) {
      console.error("Error al guardar datos:", error)
      setSaveStatus({
        success: false,
        message: "Error al guardar los datos",
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setSavingData(false)
    }
  }

  useEffect(() => {
    fetchData()

    const intervalId = setInterval(() => {
      console.log("Actualizando datos...")
      fetchData()
    }, 20000)

    return () => clearInterval(intervalId)
  }, [])

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"]

  const prepareParcelasData = () => {
    if (!data || !data.parcelas) return []
    return data.parcelas.map((parcela: any) => ({
      name: parcela.nombre,
      humedad: parcela.sensor.humedad,
      temperatura: parcela.sensor.temperatura,
      lluvia: parcela.sensor.lluvia,
      sol: parcela.sensor.sol,
    }))
  }

  const prepareCultivosData = () => {
    if (!data || !data.parcelas) return []

    const cultivosCount: Record<string, number> = {}
    data.parcelas.forEach((parcela: any) => {
      const cultivo = parcela.tipo_cultivo
      cultivosCount[cultivo] = (cultivosCount[cultivo] || 0) + 1
    })

    return Object.entries(cultivosCount).map(([name, value]) => ({ name, value }))
  }

  return (
    <>
      <main className="bg-[#f6f8fb] min-h-screen flex relative">
        <Sidebar>
          <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={"/"} />
          <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={true} alert={undefined} link={"/stats"} />
          <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={false} alert={undefined} link={"/historial"} />
          <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={false} alert={undefined} link={"/deleted"} />
          <SidebarItem icon={<MapPinArea size={32} />} text={"Locations"} active={false} alert={undefined} link={"/locations"} />
        </Sidebar>
        <div className="flex-1">
          <Header />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-600">Cargando datos...</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Estadísticas de Sensores</h1>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    <p className="text-sm text-gray-600">
                      Actualización en tiempo real | Última actualización: {lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <button
                    onClick={saveDataToDatabase}
                    disabled={savingData}
                    className="bg-gradient-to-tr from-indigo-600 to-indigo-500 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    {savingData ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      "Guardar datos manualmente"
                    )}
                  </button>

                  {saveStatus && (
                    <div className={`mt-2 text-sm ${saveStatus.success ? "text-green-600" : "text-red-600"}`}>
                      {saveStatus.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">Humedad por Parcela</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareParcelasData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="humedad" fill="#8884d8" name="Humedad (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfica de líneas - Temperatura por parcela */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">Temperatura por Parcela</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareParcelasData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="temperatura"
                          stroke="#ff8042"
                          name="Temperatura (°C)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica de barras - Comparación de lluvia y sol */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">Lluvia y Sol por Parcela</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareParcelasData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="lluvia" fill="#82ca9d" name="Lluvia (mm)" />
                        <Bar dataKey="sol" fill="#ffc658" name="Sol (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfica de pastel - Distribución de tipos de cultivo */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">Distribución de Cultivos</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareCultivosData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareCultivosData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Resumen de datos generales */}
              <div className="mt-8 bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Resumen de Sensores Generales</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm text-blue-800 font-medium">Humedad</h3>
                    <p className="text-2xl font-bold text-blue-600">{data?.sensores?.humedad}%</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-sm text-red-800 font-medium">Temperatura</h3>
                    <p className="text-2xl font-bold text-red-600">{data?.sensores?.temperatura}°C</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm text-green-800 font-medium">Lluvia</h3>
                    <p className="text-2xl font-bold text-green-600">{data?.sensores?.lluvia} mm</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm text-yellow-800 font-medium">Sol</h3>
                    <p className="text-2xl font-bold text-yellow-600">{data?.sensores?.sol}%</p>
                  </div>
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

