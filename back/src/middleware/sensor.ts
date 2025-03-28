import type { Request, Response, NextFunction } from "express"
import { param, validationResult } from "express-validator"
import { Sensor } from "../models/Sensores"

// Declaración global para extender la interfaz Request
declare global {
  namespace Express {
    interface Request {
      sensor?: any
    }
  }
}

export const validateSensorId = async (req: Request, res: Response, next: NextFunction) => {
  await param("id")
    .isInt()
    .withMessage("ID no válido")
    .custom((value) => value > 0)
    .withMessage("ID No válido")
    .run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  next()
}

export const validateSensorExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const sensor = await Sensor.findByPk(id)

    if (!sensor) {
      const error = new Error("Sensor no encontrado")
      res.status(404).json({ error: error.message })
      return
    }
    req.sensor = sensor

    next()
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" })
  }
}

