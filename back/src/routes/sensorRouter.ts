import { Router } from "express"
import { SensorController } from "../controller/sensoresController"
import { validateSensorId, validateSensorExists } from "../middleware/sensor"

const router = Router()

router.post("/", SensorController.create)
router.get("/", SensorController.getAll)

// Aplicamos los middlewares para validar el ID y la existencia del sensor
router.get("/:id", validateSensorId, validateSensorExists, SensorController.getById)
router.put("/:id", validateSensorId, validateSensorExists, SensorController.updateById)
router.delete("/:id", validateSensorId, validateSensorExists, SensorController.deleteById)

export default router

