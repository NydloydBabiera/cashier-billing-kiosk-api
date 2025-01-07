const { where, Sequelize } = require("sequelize");
const dbConn = require("../data-access/dbConnection");
const { UserIdentification } = require("../models");
const StudentTuitionDetails = require("../models/StudentTuitionDetails");
const TuitionPaymentTransactions = require("../models/TuitionPaymentTransactions");
const dotenv = require('dotenv')

dotenv.config()

const addTuitionPayment = async (req, res) => {
  const createPayment = await dbConn.transaction();
  const { amt, student_tuition_id, isPromiPayment, amount_due } = req.body;
  const transCnt = (await TuitionPaymentTransactions.count()) + 1;
  const transactionDetails = {
    transaction_code: `DOC${transCnt
      .toString()
      .padStart(3 + transCnt.toString().length, "0")}`,
    transaction_date: new Date(),
    amt_paid: amt,
    student_tuition_id,
    exam_type: process.env.EXAM_TYPE,
    isPromiPayment,
    amount_due
  };

  console.log(transactionDetails);
  try {
    const addTransaction = await TuitionPaymentTransactions.create(
      transactionDetails,
      { transaction: createPayment }
    );
    await createPayment.commit();

    return res.status(200).json(addTransaction);
  } catch (error) {
    console.log(error);
    await createPayment.rollback();
    res.json(error);
  }
};

const getAllTransactions = async (req, res) => {
  await TuitionPaymentTransactions.findAll({
    include: [
      {
        model: StudentTuitionDetails,
        as: "tuition",
        where: {
          student_tuition_details_id: {
            [Sequelize.Op.ne]: null,
          },
        },
        include: [
          {
            model: UserIdentification,
            as: "student",
          },
        ],
      },
    ],
  })
    .then((transactions) => {
      res.json(transactions);
    })
    .catch((error) => {
      res.json(error);
    });
};

const getPaymentPerStudent = async (req, res) => {
  const rfid_id = req.params.id;
  await TuitionPaymentTransactions.findAll({
    where: {
      student_tuition_id: {
        [Sequelize.Op.ne]: null,
      },
    },
    include: [
      {
        model: StudentTuitionDetails,
        as: "tuition",
        where: {
          student_tuition_details_id: {
            [Sequelize.Op.ne]: null,
          },
        },
        include: [
          {
            model: UserIdentification,
            as: "student",
            where: {
              rfid_id: {
                [Sequelize.Op.eq]: rfid_id,
              },
            },
          },
        ],
      },
    ],
  })
    .then((transactions) => {
      res.json(transactions);
    })
    .catch((error) => {
      res.json(error);
    });
};

module.exports = {
  addTuitionPayment,
  getAllTransactions,
  getPaymentPerStudent,
};
