import { json, Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateUserJWT } from "../utils/jwt"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../email/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {

    const { email, password } = req.body

  const userExist = await User.findOne({ where: { email } })

    if (userExist) {
      const error = new Error('El correo que ingreso ya esta en uso. Intente iniciar sesión.');
      res.status(409).json({ error: error.message })
      return
    }

    try {
      const user = new User(req.body)
      user.password = await hashPassword(password)
      user.token = generateToken()
      await user.save()

      await AuthEmail.sendConfirmationEmail({
          name: user.name,
          email: user.email,
          token: user.token
      })

      res.status(201).json('Cuanta creada correctamente')
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  // TODO: Verificación del usuario
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      const error = new Error('Usuario no encontrado');
      res.status(404).json({ error: error.message })
      return
    }

     if (!user.confirmed) {
         const error = new Error('User is not confirmed');
         res.status(403).json({error: error.message})
         return
     }

    const isPasswordCorrect = await checkPassword(password, user.password)

    if (!isPasswordCorrect) {
      const error = new Error('Contraseña incorrecta');
      res.status(401).json({ error: error.message })
      return
    }

    const token = generateUserJWT(user.id, user.name, user.email)

    res.json(token)
  }

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body

    const user = await User.findOne({where: { token }})
    if (!user) {
        const error = new Error('Token no válido')
        res.status(401).json({error: error.message})
        return
    }
    user.confirmed = true
    user.token = ""
    await user.save()

    res.json("Cuante confirmada correctamente")
}

  static user = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id
        const user = await User.findByPk(userId, {
            attributes: ['name', 'phone', 'email', 'password']
        });
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado'})
            return
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor', error})
    }
}

}