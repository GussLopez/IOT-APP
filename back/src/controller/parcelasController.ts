import type { Request, Response } from "express"
import { Parcela } from "../models/Parcelas"

import "../middleware/parcela"

export class ParcelaController {
  static create = async (req: Request, res: Response) => {
    try {
      const parcela = new Parcela(req.body)
      await parcela.save()

      res.status(201).json({ message: "Parcela creada correctamente" })
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" })
    }
  }

  static getAll = async (req: Request, res: Response) => {
    try {
      const parcelas = await Parcela.findAll()
      res.json(parcelas)
    } catch (error) {
      res.status(400).json({ error: "Hubo un error" })
    }
  }

  static getById = async (req: Request, res: Response) => {
    // TypeScript ahora reconoce req.parcela gracias a la importación
    res.json(req.parcela)
  }

  static updateById = async (req: Request, res: Response) => {
    await req.parcela.update(req.body)
    res.json("Cambios guardados correctamente")
  }

  static deleteById = async (req: Request, res: Response) => {
    await req.parcela.destroy()
    res.json("Parcela eliminada correctamente")
  }
}

