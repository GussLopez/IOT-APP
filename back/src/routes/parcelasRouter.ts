import { Router } from "express"
import { ParcelaController } from "../controller/parcelasController"
import { validateParcelaId, validateParcelaExists } from "../middleware/parcela"

const router = Router()

router.post("/", ParcelaController.create)
router.get("/", ParcelaController.getAll)

// Aplicamos los middlewares para validar el ID y la existencia de la parcela
router.get("/:id", validateParcelaId, validateParcelaExists, ParcelaController.getById)
router.put("/:id", validateParcelaId, validateParcelaExists, ParcelaController.updateById)
router.delete("/:id", validateParcelaId, validateParcelaExists, ParcelaController.deleteById)

export default router

