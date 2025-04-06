import { transport } from "../config/nodemailer"

type EmailType = {
    name: string,
    email: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'Proyect Manager <admin@proyectmanager.com>',
            to: user.email,
            subject: 'Proyect Manager - Confirma tu cuenta',
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta en Proyect Manager, ya esta casi lista</p>
                <p>Visita el siguiente enlace:</p>
                <a href="#">Confirmar cuenta</a>
                <p>e ingresa el código: <b>${user.token}</b></p>`
        })

        console.log('Mensaje Enviado', email.messageId);
    }
}