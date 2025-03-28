import { Table, Column, DataType, Model } from "sequelize-typescript"

@Table({
  tableName: "parcelas_eliminadas",
})
export class ParcelaEliminada extends Model {
  @Column({
    type: DataType.INTEGER,
  })
  declare parcelaId: number

  @Column({
    type: DataType.STRING(50),
  })
  declare nombre: string

  @Column({
    type: DataType.STRING(50),
  })
  declare ubicacion: string

  @Column({
    type: DataType.STRING(30),
  })
  declare responsable: string

  @Column({
    type: DataType.STRING(30),
  })
  declare tipo_cultivo: string

  @Column({
    type: DataType.DATE,
  })
  declare fecha_eliminacion: Date

  @Column({
    type: DataType.JSON,
  })
  declare datos_completos: Object
}

export default ParcelaEliminada

