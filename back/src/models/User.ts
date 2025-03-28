import { Table, Column, DataType, HasMany, BelongsTo, ForeignKey, Model, Default, Unique, AllowNull } from "sequelize-typescript"

@Table({
    tableName: 'users'
})

class User extends Model {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(60)
    })
    declare name: string
    
    @Unique(true)
    @AllowNull(false)
    @Column({
        type: DataType.STRING(70)
    })
    declare email: string
    
    @AllowNull(false)
    @Column({
        type: DataType.STRING(20)
    })
    declare phone: string
    
    @AllowNull(false)
    @Column({
        type: DataType.STRING(60)
    })
    declare password: string
}

export default User