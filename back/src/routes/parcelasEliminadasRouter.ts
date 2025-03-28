import { Router } from "express"
import { ParcelaEliminadaController } from "../controller/parcelasEliminadasController"

const router = Router()

router.post("/", ParcelaEliminadaController.create)
router.get("/", ParcelaEliminadaController.getAll)

export default router
