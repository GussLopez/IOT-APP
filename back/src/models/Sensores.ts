import { Table, Column, DataType, Model } from "sequelize-typescript"

@Table({
  tableName: "sensores",
})
export class Sensor extends Model {
  @Column({
    type: DataType.DOUBLE, // Corregido: eliminado el parámetro de longitud
  })
  declare humedad: number

  @Column({
    type: DataType.DOUBLE, // Corregido: eliminado el parámetro de longitud
  })
  declare temperatura: number

  @Column({
    type: DataType.DOUBLE, // Corregido: eliminado el parámetro de longitud
  })
  declare lluvia: number

  @Column({
    type: DataType.DOUBLE, // Corregido: eliminado el parámetro de longitud
  })
  declare sol: number
}

export default Sensor

