const UserInformation = require('./UserInformation')
const UserIdentification = require('./UserIdentification')
const AuthenticateUser = require('./AuthenticateUser');
const StudentTuitionDetails = require('./StudentTuitionDetails');
const TuitionPaymentTransactions = require('./TuitionPaymentTransactions');
const ExamTerm = require('./ExamTerm');

// associations
UserInformation.hasOne(UserIdentification,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'user_information_id',
    as: 'information'
})

UserIdentification.belongsTo(UserInformation, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'user_information_id',
    as: 'information'
 });

UserIdentification.hasOne(AuthenticateUser,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'user_identification_id',
    as: 'identification'
})

AuthenticateUser.belongsTo(UserIdentification, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'user_identification_id',
    as: 'identification'
 });


 UserIdentification.hasOne(StudentTuitionDetails,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'user_identification_id',
    as: 'student'
 })

 StudentTuitionDetails.belongsTo(UserIdentification,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'user_identification_id',
    as: 'student'
 })

 StudentTuitionDetails.hasMany(TuitionPaymentTransactions,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'student_tuition_id',
    as: 'tuition'
 })
 TuitionPaymentTransactions.belongsTo(StudentTuitionDetails,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'student_tuition_id',
    as: 'tuition'
 })
module.exports ={
    UserInformation,
    UserIdentification,
    ExamTerm
}