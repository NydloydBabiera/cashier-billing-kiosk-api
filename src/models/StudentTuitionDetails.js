const Sequelize = require('sequelize')
const dbConn = require('../data-access/dbConnection')

const StudentTuitionDetails = dbConn.define('student_tuition_details',{
    student_tuition_details_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
    tuition_amt:{
        type: Sequelize.FLOAT,
        allowNull: false,
        unique: false
    },
})

module.exports = StudentTuitionDetails