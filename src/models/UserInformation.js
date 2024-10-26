const Sequelize = require('sequelize')
const dbConn = require('../data-access/dbConnection')

const UserInformation = dbConn.define('user_information',{
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
    firstName:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
    middleName:{
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
    },
    lastName:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },

})

module.exports = UserInformation