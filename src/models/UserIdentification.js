const Sequelize = require('sequelize')
const dbConn = require('../data-access/dbConnection')
const sequilize = require('../data-access/dbConnection')
const UserInformation = require('./UserInformation')

const UserIdentification = dbConn.define('user_identification',{
    user_identification_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_number:{
        type: Sequelize.STRING,
        allowNull: false,
        uique: true
    },
    rfid_id:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    user_type:{
        type: Sequelize.ENUM('ADMIN', 'STUDENT', 'TREASURY','CASHIER'),
        allowNull: false,
        unique: false
    }
})



module.exports = UserIdentification