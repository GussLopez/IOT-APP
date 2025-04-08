"use client"

import { useEffect, useState } from "react"
import { SquaresFour, ChartLine, MapPinArea, Clock, Trash, Drop } from "@phosphor-icons/react"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { saveAllApiData } from "../services/dataService"

export default function StatsView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [savingData, setSavingData] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null)

  const fetchData = async () => {
    try {
      setLoading((prevLoading) => {
        // Only show loading on initial load, not on updates
        return prevLoading && !data
      })
      const response = await axios.get("https://moriahmkt.com/iotapp/test/")
      setData(response.data)
      setLastUpdated(new Date())
      setLoading(false)

      // Guardar datos en la base de datos automáticamente
      saveDataToDatabase()
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // Función para guardar datos en la base de datos
  const saveDataToDatabase = async () => {
    try {
      setSavingData(true)
      console.log("Iniciando guardado de datos desde StatsView...")
      const result = await saveAllApiData()
      console.log("Resultado del guardado:", result)
      setSaveStatus(result)

      // Ocultar el mensaje después de 3 segundos
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
    // Fetch data immediately on component mount
    fetchData()

    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(() => {
      console.log("Actualizando datos...")
      fetchData()
    }, 10000) // 10000 ms = 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Colores para las gráficas
  const colors = {
    temperatura: "#ff8042", // naranja/rojo
    sol: "#ffc658", // amarillo
    lluvia: "#82ca9d", // verde
    humedad: "#8884d8", // azul/morado
  }

  // Preparar datos para el histograma de temperatura y sol
  const prepareTemperatureSunData = () => {
    if (!data || !data.parcelas || data.parcelas.length === 0) return []

    // Calcular promedios
    const avgTemperature =
      data.parcelas.reduce((sum: number, parcela: any) => sum + parcela.sensor.temperatura, 0) / data.parcelas.length
    const avgSun =
      data.parcelas.reduce((sum: number, parcela: any) => sum + parcela.sensor.sol, 0) / data.parcelas.length

    // Crear datos para el histograma
    return [
      {
        name: "Temperatura",
        value: avgTemperature,
        unit: "°C",
        fill: colors.temperatura,
      },
      {
        name: "Sol",
        value: avgSun,
        unit: "%",
        fill: colors.sol,
      },
    ]
  }

  // Preparar datos para el histograma de lluvia y humedad
  const prepareRainHumidityData = () => {
    if (!data || !data.parcelas || data.parcelas.length === 0) return []

    // Calcular promedios
    const avgRain =
      data.parcelas.reduce((sum: number, parcela: any) => sum + parcela.sensor.lluvia, 0) / data.parcelas.length
    const avgHumidity =
      data.parcelas.reduce((sum: number, parcela: any) => sum + parcela.sensor.humedad, 0) / data.parcelas.length

    // Crear datos para el histograma
    return [
      {
        name: "Lluvia",
        value: avgRain,
        unit: "mm",
        fill: colors.lluvia,
      },
      {
        name: "Humedad",
        value: avgHumidity,
        unit: "%",
        fill: colors.humedad,
      },
    ]
  }

  // Preparar datos para gráfica de distribución de cultivos
  const prepareCultivosData = () => {
    if (!data || !data.parcelas) return []

    const cultivosCount: Record<string, number> = {}
    data.parcelas.forEach((parcela: any) => {
      const cultivo = parcela.tipo_cultivo
      cultivosCount[cultivo] = (cultivosCount[cultivo] || 0) + 1
    })

    return Object.entries(cultivosCount)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 10) // Limit to 10 records
  }

  // Personalizar el tooltip para mostrar unidades
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-gray-700">{`${payload[0].value.toFixed(2)} ${payload[0].payload.unit}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <>
      <main className="bg-[#f6f8fb] min-h-screen flex relative">
      <Sidebar>
        <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={'/'} />
        <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={true} alert={undefined} link={'/stats'} />
        <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={false} alert={undefined} link={"/historial"} />
        <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={false} alert={undefined} link={"/deleted"} />
        <SidebarItem icon={<Drop size={32} />} text={"Zona de Riegos"} active={false} alert={undefined} link={"/irrigation"} />
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
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

              {/* Histograma de Temperatura y Sol */}
              <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Promedio de Temperatura y Sol</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareTemperatureSunData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      barSize={100}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Valor">
                        {prepareTemperatureSunData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Promedio de temperatura y sol en todas las parcelas
                </div>
              </div>

              {/* Histograma de Lluvia y Humedad */}
              <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Promedio de Lluvia y Humedad</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareRainHumidityData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      barSize={100}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Valor">
                        {prepareRainHumidityData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Promedio de lluvia y humedad en todas las parcelas
                </div>
              </div>

              {/* Distribución de cultivos */}
              <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Distribución de Cultivos</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareCultivosData()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value} parcelas`, "Cantidad"]} />
                      <Legend />
                      <Bar dataKey="value" name="Cantidad de parcelas" fill="#8884d8">
                        {prepareCultivosData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              colors[Object.keys(colors)[index % Object.keys(colors).length] as keyof typeof colors]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Resumen de datos generales */}
              <div className="bg-white p-4 rounded-xl shadow">
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
