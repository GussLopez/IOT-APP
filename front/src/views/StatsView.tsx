"use client"

import { useEffect, useState } from "react"
import { SquaresFour, ChartLine, Clock, Trash, Drop } from "@phosphor-icons/react"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import axios from "axios"
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
} from "recharts"
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
        return prevLoading && !data
      })
      const response = await axios.get("https://moriahmkt.com/iotapp/updated/")
      setData(response.data)
      setLastUpdated(new Date())
      setLoading(false)

      saveDataToDatabase()
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
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  const colors = {
    temperatura: "#ff8042",
    sol: "#ffc658",
    lluvia: "#82ca9d",
    humedad: "#8884d8",
  }

  // Preparar datos para el gráfico de líneas de temperatura y sol
  const prepareTemperatureSunData = () => {
    if (!data || !data.parcelas || data.parcelas.length === 0) return []

    return data.parcelas
      .map((parcela: any, index: number) => ({
        name: `Parcela ${index + 1}`,
        temperatura: parcela.sensor.temperatura,
        sol: parcela.sensor.sol,
      }))
      .slice(0, 10) // Limitamos a 10 parcelas para mejor visualización
  }

  // Preparar datos para el diagrama de Pareto de lluvia y humedad
  const prepareRainHumidityData = () => {
    if (!data || !data.parcelas || data.parcelas.length === 0) return []

    // Extraer datos de parcelas y ordenar por lluvia (descendente)
    const parcelasData = data.parcelas.map((parcela: any, index: number) => ({
      name: `Parcela ${index + 1}`,
      lluvia: parcela.sensor.lluvia,
      humedad: parcela.sensor.humedad,
    }))

    return parcelasData.sort((a: any, b: any) => b.lluvia - a.lluvia).slice(0, 10) // Limitamos a 10 parcelas para mejor visualización
  }

  // Preparar datos para el diagrama de frecuencias de cultivos
  const prepareCultivosData = () => {
    if (!data || !data.parcelas) return []

    const cultivosCount: Record<string, number> = {}
    data.parcelas.forEach((parcela: any) => {
      const cultivo = parcela.tipo_cultivo
      cultivosCount[cultivo] = (cultivosCount[cultivo] || 0) + 1
    })

    // Convertir a array y ordenar por cantidad (descendente)
    const cultivosArray = Object.entries(cultivosCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    // Calcular el porcentaje acumulado
    const total = cultivosArray.reduce((sum, item) => sum + item.value, 0)
    let accumulated = 0

    return cultivosArray.map((item) => {
      accumulated += item.value
      return {
        ...item,
        percentage: (item.value / total) * 100,
        accumulated: (accumulated / total) * 100,
      }
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-gray-700">
              {`${entry.name}: ${entry.value.toFixed(2)} ${entry.unit || ""}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <>
      <main className="bg-[#f6f8fb] min-h-screen flex relative">
        <Sidebar>
          <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={"/"} />
          <SidebarItem
            icon={<ChartLine size={32} />}
            text={"Estadísticas"}
            active={true}
            alert={undefined}
            link={"/stats"}
          />
          <SidebarItem
            icon={<Clock size={32} />}
            text={"Historial"}
            active={false}
            alert={undefined}
            link={"/historial"}
          />
          <SidebarItem
            icon={<Trash size={32} />}
            text={"Eliminados"}
            active={false}
            alert={undefined}
            link={"/deleted"}
          />
          <SidebarItem
            icon={<Drop size={32} />}
            text={"Zona de Riegos"}
            active={false}
            alert={undefined}
            link={"/irrigation"}
          />
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

              {/* Gráfico de Líneas para Temperatura y Sol */}
              <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Temperatura y Sol por Parcela</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareTemperatureSunData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke={colors.temperatura} />
                      <YAxis yAxisId="right" orientation="right" stroke={colors.sol} />
                      <Tooltip
                        content={<CustomTooltip />}
                        formatter={(value, name) => {
                          const unit = name === "temperatura" ? "°C" : "%"
                          return [value, name, unit]
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperatura"
                        name="Temperatura"
                        stroke={colors.temperatura}
                        activeDot={{ r: 8 }}
                        unit="°C"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="sol"
                        name="Sol"
                        stroke={colors.sol}
                        activeDot={{ r: 8 }}
                        unit="%"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Temperatura y sol por parcela (primeras 10 parcelas)
                </div>
              </div>

              {/* Diagrama de Pareto para Lluvia y Humedad */}
              <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Diagrama de Pareto: Lluvia y Humedad</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={prepareRainHumidityData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke={colors.lluvia} />
                      <YAxis yAxisId="right" orientation="right" stroke={colors.humedad} />
                      <Tooltip
                        content={<CustomTooltip />}
                        formatter={(value, name) => {
                          const unit = name === "lluvia" ? "mm" : "%"
                          return [value, name, unit]
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="lluvia" name="Lluvia" fill={colors.lluvia} unit="mm" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="humedad"
                        name="Humedad"
                        stroke={colors.humedad}
                        unit="%"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Parcelas ordenadas por cantidad de lluvia (mm) con humedad (%)
                </div>
              </div>

              {/* Diagrama de Frecuencias para Cultivos */}
              <div className="bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Diagrama de Frecuencias: Distribución de Cultivos</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={prepareCultivosData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "accumulated") return [`${value.toFixed(2)}%`, "Porcentaje acumulado"]
                          if (name === "percentage") return [`${value.toFixed(2)}%`, "Porcentaje"]
                          return [value, "Cantidad de parcelas"]
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" name="Cantidad" fill="#8884d8">
                        {prepareCultivosData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              colors[Object.keys(colors)[index % Object.keys(colors).length] as keyof typeof colors]
                            }
                          />
                        ))}
                      </Bar>
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="accumulated"
                        name="% Acumulado"
                        stroke="#ff7300"
                        dot={true}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">
                  Distribución de cultivos con porcentaje acumulado
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
