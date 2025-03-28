import { Table, Column, DataType, HasMany, Model } from "sequelize-typescript"

@Table({
    tableName: 'parcelas'
})
export class Parcela extends Model {
  @Column({
    type: DataType.STRING(50)
  })
  declare nombre: string

  @Column({
    type: DataType.STRING(50)
  })
  declare ubicacion: string

  @Column({
    type: DataType.STRING(30)
  })
  declare responsable: string

  @Column({
    type: DataType.STRING(30)
  })
  declare tipo_cultivo: string

  @Column({
    type: DataType.STRING(50)
  })
  declare ultimo_riego: string
  
  @Column({
    type: DataType.JSON
  })
  declare sensor: Object
  
  @Column({
    type: DataType.DOUBLE
  })
  declare latitud: number
  
  @Column({
    type: DataType.DOUBLE
  })
  declare longitud: number

}

export default Parcela