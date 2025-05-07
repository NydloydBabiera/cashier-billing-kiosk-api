const { where, Op, sequelize, Sequelize } = require("sequelize");
const { UserIdentification, ExamTerm } = require("../models");
const AuthenticateUser = require("../models/AuthenticateUser");
const UserInformation = require("../models/UserInformation");
const dbConn = require("../data-access/dbConnection");
const TuitionPaymentTransactions = require("../models/TuitionPaymentTransactions");
const getAllUsers = async (req, res, next) => {
  await UserInformation.findAll({
    include: [
      {
        model: UserIdentification,
        as: "information",
      },
    ],
  })
    .then((users) => {
      return res.json(users);
    })
    .catch((error) => {
      console.error(error);
    });
};

const addNewUser = async (req, res) => {
  const createUser = await dbConn.transaction();
  const { firstName, idNumber, lastName, middleName, rfidNumber, userType } =
    req.body;
  // const { userInformation, userIdentification } = req.body;

  const userInformation = {
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
  };
  const userIdentification = {
    id_number: idNumber,
    rfid_id: rfidNumber,
    user_type: userType,
  };

  const userName = userInformation.firstName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .concat(userInformation.lastName);

  const authCredentials = {
    user_name: userName.toLowerCase(),
    user_password: userName.toLowerCase(),
  };

  console.log(userInformation);
  console.log(userIdentification);
  console.log(authCredentials);

  try {
    const addUserInformation = await UserInformation.create(userInformation, {
      transaction: createUser,
    });
    userIdentification.user_information_id = addUserInformation.user_id;

    const addUserIdentification = await UserIdentification.create(
      userIdentification,
      { transaction: createUser }
    );
    authCredentials.user_identification_id =
      addUserIdentification.user_identification_id;

    const addUserAuthentication = await AuthenticateUser.create(
      authCredentials,
      { transaction: createUser }
    );

    await createUser.commit();

    return res.status(200).json({
      addUserInformation,
      addUserIdentification,
      addUserAuthentication,
    });
  } catch (error) {
    res.json(error);

    await createUser.rollback();
  }
};

const getUserPerRFID = async (req, res) => {
  const rfid_id = req.params.id;

  try {
    await UserInformation.findAll({
      where: {
        firstName: "john test",
      },
      include: [
        {
          model: UserIdentification,
          as: "information",
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
        console.error(error);
      });
  } catch (error) {
    return res.json(error);
  }
};

const authenticateUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    await AuthenticateUser.findOne({
      where: {
        user_name: { [Sequelize.Op.eq]: username },
        user_password: { [Sequelize.Op.eq]: password },
      },
      include: [
        {
          model: UserIdentification,
          as: "identification",
        },
      ],
    })
      .then((auth) => {
        if (username === password) {
          auth.dataValues.isFirstLogin = true;
        }
        return res.json(auth);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    return res.json(error);
  }
};

const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const authenticate_user_id = req.params.id;
  try {
    await AuthenticateUser.update(
      {
        user_password: newPassword,
      },
      {
        where: {
          authenticate_user_id: authenticate_user_id,
        },
      }
    )
      .then((auth) => {
        return res.json(auth);
      })
      .catch((error) => {
        res.json(error);
        console.error(error);
      });
  } catch (error) {
    res.json(error);
  }
};

const setExamTerm = async (req, res) => {
  const { term } = req.body;
  try {
    await ExamTerm.update(
      {
        exam_term: term,
      },
      {
        where: {
          id: 1,
        },
      }
    ).then((term) => {
      return res.json(term);
    });
  } catch (error) {
    res.json(error);
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
 
  // await TuitionPaymentTransactions.destroy({
  //   where 
  // })
}

module.exports = {
  getAllUsers,
  addNewUser,
  getUserPerRFID,
  authenticateUser,
  updatePassword,
  setExamTerm
};
