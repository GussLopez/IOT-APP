import axios from "axios"

const API_BASE_URL = "http://localhost:4000/api"

let previousParcelas: any[] = []

export const fetchApiData = async () => {
  try {
    const response = await axios.get("https://moriahmkt.com/iotapp/test/")
    return response.data
  } catch (error) {
    console.error("Error al obtener datos de la API:", error)
    throw error
  }
}

export const saveSensorData = async (sensorData: any) => {
  try {
    console.log("Guardando datos de sensor:", sensorData)

    const response = await axios.post(`${API_BASE_URL}/sensores`, {
      humedad: sensorData.humedad,
      temperatura: sensorData.temperatura,
      lluvia: sensorData.lluvia,
      sol: sensorData.sol,
    })

    console.log("Respuesta al guardar sensor:", response.data)
    return response.data
  } catch (error) {
    console.error("Error al guardar datos de sensores:", error)
    if (axios.isAxiosError(error) && error.response) {
      console.error("Detalles del error:", error.response.data)
    }
    throw error
  }
}

// Función para guardar los datos de parcelas
export const saveParcelaData = async (parcelaData: any) => {
  try {
    console.log("Guardando datos de parcela:", parcelaData)

    const response = await axios.post(`${API_BASE_URL}/parcelas`, {
      nombre: parcelaData.nombre,
      ubicacion: parcelaData.ubicacion,
      responsable: parcelaData.responsable,
      tipo_cultivo: parcelaData.tipo_cultivo,
      ultimo_riego: parcelaData.ultimo_riego,
      sensor: parcelaData.sensor,
      latitud: parcelaData.latitud,
      longitud: parcelaData.longitud,
    })

    console.log("Respuesta al guardar parcela:", response.data)
    return response.data
  } catch (error) {
    console.error("Error al guardar datos de parcela:", error)
    if (axios.isAxiosError(error) && error.response) {
      console.error("Detalles del error:", error.response.data)
    }
    throw error
  }
}

export const detectDeletedParcelas = async (currentParcelas: any[]) => {
  // Si no hay datos previos, solo guardamos los actuales y salimos
  if (previousParcelas.length === 0) {
    previousParcelas = [...currentParcelas]
    return []
  }

  // Encontrar parcelas que estaban en la lista anterior pero no en la actual
  const deletedParcelas = previousParcelas.filter(
    (prevParcela) => !currentParcelas.some((currParcela) => currParcela.id === prevParcela.id),
  )

  console.log(`Detectadas ${deletedParcelas.length} parcelas eliminadas`)

  // Registrar cada parcela eliminada
  for (const deletedParcela of deletedParcelas) {
    try {
      await axios.post(`${API_BASE_URL}/parcelas-eliminadas`, {
        parcelaId: deletedParcela.id,
        nombre: deletedParcela.nombre,
        ubicacion: deletedParcela.ubicacion,
        responsable: deletedParcela.responsable,
        tipo_cultivo: deletedParcela.tipo_cultivo,
        datos_completos: deletedParcela,
      })
      console.log(`Parcela eliminada registrada: ${deletedParcela.nombre}`)
    } catch (error) {
      console.error(`Error al registrar parcela eliminada ${deletedParcela.nombre}:`, error)
    }
  }

  // Actualizar la lista de parcelas previas
  previousParcelas = [...currentParcelas]

  return deletedParcelas
}

export const saveAllApiData = async () => {
  try {
    console.log("Iniciando guardado de todos los datos...")
    const apiData = await fetchApiData()

    console.log("Guardando datos de sensores generales...")
    await saveSensorData(apiData.sensores)

    console.log(`Guardando datos de ${apiData.parcelas.length} parcelas...`)
    for (const parcela of apiData.parcelas) {
      await saveParcelaData(parcela)
    }

    console.log("Todos los datos guardados correctamente")
    return { success: true, message: "Datos guardados correctamente" }
  } catch (error) {
    console.error("Error al guardar todos los datos:", error)
    return {
      success: false,
      message: "Error al guardar los datos",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export const getDeletedParcelasHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/parcelas-eliminadas`)
    return response.data
  } catch (error) {
    console.error("Error al obtener historial de parcelas eliminadas:", error)
    throw error
  }
}
