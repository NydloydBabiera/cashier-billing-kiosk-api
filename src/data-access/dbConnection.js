const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const sequilize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        port: process.env.PGPORT,
        host: process.env.HOST,
        dialect: 'postgres'
    }
)

module.exports = sequilize