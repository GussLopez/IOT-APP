import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../controller/AuthController";
import { authenticate } from "../middleware/auth";


const router = Router();


router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('phone')
        .notEmpty().withMessage('El teléfono es obligatorio'),
    body('email')
        .isEmail().withMessage('Correo inválido'),
    body('password')
        .isLength({min: 8}).withMessage('La contraseña debe ser mínimo de 8 caracteres'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/login', 
    body('email')
        .isEmail().withMessage('Correo inválido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),
    handleInputErrors,
    AuthController.login
)

router.get('/user', 
    authenticate,
    AuthController.user
)
export default router