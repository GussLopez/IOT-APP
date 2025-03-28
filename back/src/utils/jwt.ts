import jwt from 'jsonwebtoken'

export const generateUserJWT = (id: string, name: string, email: string) => {
    const token = jwt.sign({id, name, email}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
    return token
}