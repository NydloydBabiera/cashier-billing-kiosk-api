const Sequelize = require("sequelize");
const dbConn = require("../data-access/dbConnection");

const TuitionPaymentTransactions = dbConn.define(
  "tuition_payment_transaction",
  {
    tuition_payment_transaction_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    transaction_date: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: false,
    },
    amt_paid: {
      type: Sequelize.FLOAT,
      allowNull: false,
      unique: false,
    },
    isPromiPayment: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      unique: false,
    },
    exam_type: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    amount_due: {
      type: Sequelize.FLOAT,
      allowNull: false,
      unique: false,
    },
    isApproved: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      unique: false,
    },
    remarks: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false,
    },
  }
);

module.exports = TuitionPaymentTransactions;
