const { Sequelize } = require("sequelize");
const dbConn = require("../data-access/dbConnection");
const { UserIdentification, UserInformation } = require("../models");
const StudentTuitionDetails = require("../models/StudentTuitionDetails");
const TuitionPaymentTransactions = require("../models/TuitionPaymentTransactions");

const addStudentTuition = async (req, res) => {
  const createTuition = await dbConn.transaction();
  const tuitionDetails = req.body;
  try {
    const addTution = await StudentTuitionDetails.create(tuitionDetails, {
      transaction: createTuition,
    });

    await createTuition.commit();

    return res.status(200).json(addTution);
  } catch (error) {
    res.json(error);
    await createTuition.rollback();
  }
};

const tuitionDetails = async (req, res) => {
  const rfid_id = req.params.id;
  await StudentTuitionDetails.findOne({
    include: [
      {
        model: UserIdentification,
        as: "student",
        where: {
          rfid_id: {
            [Sequelize.Op.eq]: rfid_id,
          },
        },
        include: [
          {
            model: UserInformation,
            as: "information",
          },
        ],
      },
      {
        model: TuitionPaymentTransactions,
        as: "tuition",
        required: false,
      },
    ],
  })
    .then((users) => {
      const details = {
        tuition_id: users.student_tuition_details_id,
        firstName: users.student.information.firstName,
        middleName: users.student.information.middleName,
        lastName: users.student.information.lastName,
        totalTuition: users.tuition_amt,
        balance:
          users.tuition_amt -
          users.tuition?.reduce((acc, curr) => acc + curr.amt_paid, 0),
        amount_due: users.tuition?.length === 4 ? 0 : users.tuition_amt / 4,
        amount_paid: users.tuition?.reduce(
          (acc, curr) => acc + curr.amt_paid,
          0
        ),
        paymentsCnt: users.tuition?.length,
      };
      return res.json(details);
    })
    .catch((error) => {
      res.json(error);
      console.error(error);
    });
};

const getAllStudentTuition = async (req, res) => {
  const rfid_id = req.params.id;
  await UserInformation.findAll({
    include: [
      {
        model: UserIdentification,
        as: "information",
        include: [
          {
            model: StudentTuitionDetails,
            as: "student",
            include: [
              {
                model: TuitionPaymentTransactions,
                as: "tuition",
                required: false,
              },
            ],
          },
        ],
      },
    ],
  })
    .then((users) => {
      return res.json(users);
    })
    .catch((error) => {
      res.json(error);
      console.error(error);
    });
};

module.exports = { addStudentTuition, tuitionDetails, getAllStudentTuition };
