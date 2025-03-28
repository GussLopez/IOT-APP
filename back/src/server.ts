import express from 'express'
import colors from 'colors'
import cors from 'cors'
import morgan from 'morgan'
import { db } from './config/db'
import { corsConfig } from './config/cors'
import parcelaRoutes from './routes/parcelasRouter';
import sensorRoutes from './routes/sensorRouter';
import authRouter from './routes/authRouter'
import parcelasEliminadasRoutes from "./routes/parcelasEliminadasRouter"

async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.magenta.bold('Conexión exitosa a la BD'));
  } catch (error) {
    console.log(colors.red.bold('Falló la conexión a la BD'));
  }
}
connectDB()

const app = express()

app.use(cors(corsConfig)) 

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/parcelas', parcelaRoutes);
app.use('/api/sensores', sensorRoutes);
app.use("/api/parcelas-eliminadas", parcelasEliminadasRoutes)

export default app