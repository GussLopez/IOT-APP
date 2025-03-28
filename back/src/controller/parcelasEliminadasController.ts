import type { Request, Response } from "express"
import { ParcelaEliminada } from "../models/ParcelasEliminadas"

export class ParcelaEliminadaController {
  static create = async (req: Request, res: Response) => {
    try {
      const parcelaEliminada = new ParcelaEliminada({
        ...req.body,
        fecha_eliminacion: new Date(),
      })
      await parcelaEliminada.save()

      res.status(201).json({ message: "Registro de parcela eliminada creado correctamente" })
    } catch (error) {
      console.error("Error al crear registro de parcela eliminada:", error)
      res.status(500).json({ error: "Hubo un error al registrar la parcela eliminada" })
    }
  }

  static getAll = async (req: Request, res: Response) => {
    try {
      const parcelasEliminadas = await ParcelaEliminada.findAll({
        order: [["fecha_eliminacion", "DESC"]],
      })
      res.json(parcelasEliminadas)
    } catch (error) {
      console.error("Error al obtener parcelas eliminadas:", error)
      res.status(400).json({ error: "Hubo un error al obtener el historial de parcelas eliminadas" })
    }
  }
}

