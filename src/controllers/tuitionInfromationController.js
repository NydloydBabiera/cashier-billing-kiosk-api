const { Sequelize } = require("sequelize");
const dbConn = require("../data-access/dbConnection");
const { UserIdentification } = require("../models");
const StudentTuitionDetails = require("../models/StudentTuitionDetails");

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

module.exports = { addStudentTuition, tuitionDetails };
