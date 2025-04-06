import { Table, Column, DataType, Model } from "sequelize-typescript"

@Table({
  tableName: "sensores",
})
export class Sensor extends Model {
  @Column({
    type: DataType.DOUBLE,
  })
  declare humedad: number

  @Column({
    type: DataType.DOUBLE,
  })
  declare temperatura: number

  @Column({
    type: DataType.DOUBLE,
  })
  declare lluvia: number

  @Column({
    type: DataType.DOUBLE,
  })
  declare sol: number
}

export default Sensor

