import type { Request, Response, NextFunction } from "express"
import { param, validationResult } from "express-validator"
import { Parcela } from "../models/Parcelas"

declare global {
  namespace Express {
    interface Request {
      parcela?: any 
    }
  }
}

export const validateParcelaId = async (req: Request, res: Response, next: NextFunction) => {
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

export const validateParcelaExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params 
    const parcela = await Parcela.findByPk(id)

    if (!parcela) {
      const error = new Error("Parcela no encontrada")
      res.status(404).json({ error: error.message })
      return
    }
    req.parcela = parcela

    next()
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" })
  }
}

