const Sequelize = require('sequelize')
const dbConn = require('../data-access/dbConnection')

const AuthenticateUser = dbConn.define('authenticate_user',{
    authenticate_user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_name:{
        type: Sequelize.STRING,
        allowNull: false,
        uique: true
    },
    user_password:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
})

module.exports = AuthenticateUser