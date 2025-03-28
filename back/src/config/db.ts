import { Sequelize } from "sequelize-typescript"
import dotenv from  'dotenv'

dotenv.config()

export const db = new Sequelize( 'postgresql://test_db_i10y_user:CuiArF3QlLGEBT8NZErPyRlnsmkY2oD2@dpg-cvh9t78gph6c73fjlprg-a.oregon-postgres.render.com/test_db_i10y' , {
    models: [__dirname + '/../models/**/*'],
    logging: false,
    dialectOptions: {
        ssl: {
            require: false
        }
    }
})