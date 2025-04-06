import { Parcela } from "../models/Parcelas"
import { ParcelaEliminada } from "../models/ParcelasEliminadas"

// URL base de la API
const API_BASE_URL = "http://localhost:4000/api"


// Función para guardar los datos de parcelas
export const saveParcelaData = async (parcelaData: any) => {
  try {
    console.log("Guardando datos de parcela:", parcelaData)

    // Verificar si la parcela ya existe
    const existingParcela = await Parcela.findByPk(parcelaData.id)

    if (existingParcela) {
      // Actualizar parcela existente
      await existingParcela.update({
        nombre: parcelaData.nombre,
        ubicacion: parcelaData.ubicacion,
        responsable: parcelaData.responsable,
        tipo_cultivo: parcelaData.tipo_cultivo,
        ultimo_riego: parcelaData.ultimo_riego,
        sensor: parcelaData.sensor,
        latitud: parcelaData.latitud,
        longitud: parcelaData.longitud,
        activa: true,
      })
      console.log(`Parcela actualizada: ${parcelaData.nombre} (ID: ${parcelaData.id})`)
    } else {
      // Crear nueva parcela
      await Parcela.create({
        id: parcelaData.id,
        nombre: parcelaData.nombre,
        ubicacion: parcelaData.ubicacion,
        responsable: parcelaData.responsable,
        tipo_cultivo: parcelaData.tipo_cultivo,
        ultimo_riego: parcelaData.ultimo_riego,
        sensor: parcelaData.sensor,
        latitud: parcelaData.latitud,
        longitud: parcelaData.longitud,
        activa: true,
      })
      console.log(`Nueva parcela creada: ${parcelaData.nombre} (ID: ${parcelaData.id})`)
    }

    return { success: true, message: "Parcela guardada correctamente" }
  } catch (error) {
    console.error("Error al guardar datos de parcela:", error)
    throw error
  }
}

// Nueva función para detectar y registrar parcelas eliminadas (basada en el código proporcionado)
export const detectDeletedParcelas = async (currentParcelas: any[]) => {
  try {
    console.log("Detectando parcelas eliminadas...")

    // Obtener todas las parcelas de la base de datos
    const existingParcelas = await Parcela.findAll()

    // Obtener los IDs de las parcelas actuales de la API
    const apiParcelaIds = currentParcelas.map((p) => p.id)

    // Parcelas eliminadas
    const deletedParcelas = []

    // Verificar cada parcela existente
    for (const existingParcela of existingParcelas) {
      // Si la parcela no está en la API actual
      if (!apiParcelaIds.includes(existingParcela.id)) {
        // Marcar como inactiva
        await existingParcela.update({ activa: false })

        // Registrar en la tabla de parcelas eliminadas
        const ultimoSensor = existingParcela.sensor || {}

        await ParcelaEliminada.create({
          parcelaId: existingParcela.id,
          nombre: existingParcela.nombre,
          ubicacion: existingParcela.ubicacion,
          responsable: existingParcela.responsable,
          tipo_cultivo: existingParcela.tipo_cultivo,
          ultimo_riego: existingParcela.ultimo_riego,
          latitud: existingParcela.latitud,
          longitud: existingParcela.longitud,
          ultima_temperatura: ultimoSensor.temperatura,
          ultima_humedad: ultimoSensor.humedad,
          ultima_lluvia: ultimoSensor.lluvia,
          ultimo_sol: ultimoSensor.sol,
          fecha_eliminacion: new Date(),
        })

        console.log(`Parcela ID: ${existingParcela.id} marcada como no disponible`)
        deletedParcelas.push(existingParcela)
      }
    }

    console.log(`Se detectaron ${deletedParcelas.length} parcelas eliminadas`)
    return deletedParcelas
  } catch (error) {
    console.error("Error al detectar parcelas eliminadas:", error)
    return []
  }
}

export const getDeletedParcelasHistory = async () => {
  try {
    // Obtener directamente de la base de datos en lugar de usar la API
    const parcelasEliminadas = await ParcelaEliminada.findAll({
      order: [["fecha_eliminacion", "DESC"]],
    })
    return parcelasEliminadas
  } catch (error) {
    console.error("Error al obtener historial de parcelas eliminadas:", error)
    throw error
  }
}

