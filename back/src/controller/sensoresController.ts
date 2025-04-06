import type { Request, Response } from "express"
import { Sensor } from "../models/Sensores"

import "../middleware/sensor"

export class SensorController {
  static create = async (req: Request, res: Response) => {
    try {
      const sensor = new Sensor(req.body)
      await sensor.save()

      res.status(201).json({ message: "Sensor creado correctamente" })
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" })
    }
  }

  static getAll = async (req: Request, res: Response) => {
    try {
      const sensor = await Sensor.findAll()
      res.json(sensor)
    } catch (error) {
      res.status(400).json({ error: "Hubo un error" })
    }
  }

  static getById = async (req: Request, res: Response) => {
    res.json(req.sensor)
  }

  static updateById = async (req: Request, res: Response) => {
    await req.sensor.update(req.body)
    res.json("Cambios guardados correctamente")
  }

  static deleteById = async (req: Request, res: Response) => {
    await req.sensor.destroy()
    res.json("Sensor eliminado correctamente")
  }
}

