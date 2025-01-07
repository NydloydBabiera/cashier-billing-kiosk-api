const { Sequelize } = require("sequelize");
const dbConn = require("../data-access/dbConnection");
const { UserIdentification, UserInformation } = require("../models");
const StudentTuitionDetails = require("../models/StudentTuitionDetails");
const TuitionPaymentTransactions = require("../models/TuitionPaymentTransactions");
const dotenv = require('dotenv')

dotenv.config()
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
        // amt_balance: users.tuition?.length === 4 ? 0 : (users.tuition_amt / 4) - users.tuition?.reduce(
        // amt_balance: ((computeBalance(users.tuition_amt)) - users.tuition?.reduce((acc, curr) => {
        //   // Check if the type already exists in the accumulator
        //   if (acc[curr.exam_type]) {
        //     acc[curr.exam_type] += curr.amt_paid;  // Add amt_paid to the existing sum for that type
        //   } else {
        //     acc[curr.exam_type] = curr.amt_paid;  // Initialize the sum for this type
        //   }
        //   console.log(acc)
        //   return acc;
        // }, {})),
        amt_balance: (
          computeBalance(users.tuition_amt) -  
          Object.values(users.tuition?.reduce((acc, curr) => {
            // Check if the exam_type already exists in the accumulator
            if (acc[curr.exam_type]) {
              acc[curr.exam_type] += curr.amt_paid;  // Add amt_paid to the existing sum for that exam type
            } else {
              acc[curr.exam_type] = curr.amt_paid;  // Initialize the sum for this exam type
            }
            return acc;
          }, {})).reduce((sum, amtPaid) => sum + amtPaid, 0)), // Sum all the values (amt_paid) in the accumulator) ,
        // amt_balance: ((computeBalance(users.tuition_amt)) - users.tuition?.reduce(
        //   (acc, curr) => acc + curr.amt_paid,
        //   0
        // )),
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

const getPromiPayment = async (req, res) => {
  await TuitionPaymentTransactions.findAll({
    where: {
      isPromiPayment: {
        [Sequelize.Op.eq]: true,
      }
    },
    include: [
      {
        model: StudentTuitionDetails,
        as: "tuition",
        include: [
          {
            model: UserIdentification,
            as: "student",
            include: [
              {
                model: UserInformation,
                as: "information"
              }
            ]
          }
        ]
      }

    ]
  })
    .then((tuition) => {
      return res.json(tuition);
    })
    .catch((error) => {
      res.json(error);
      console.error(error);
    });
}

const computeBalance = (total_tuition) => {
  console.log(total_tuition)
  switch (process.env.EXAM_TYPE) {
    case "PRE-MIDTERM":
      return total_tuition * 0.25

    case "MIDTERM":
      return total_tuition * 0.5

    case "PRE-FINAL":
      return total_tuition * 0.75

    case "FINAL":
      return total_tuition * 1
    default:
      break;
  }
}


module.exports = { addStudentTuition, tuitionDetails, getAllStudentTuition, getPromiPayment };
