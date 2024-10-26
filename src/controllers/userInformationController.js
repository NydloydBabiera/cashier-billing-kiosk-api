const UserInformation = require('../models/UserInformation')
exports.getAllUsers = async (req, res, next) => {
    try {
      const getAllUsers = await UserInformation.findAll();
      return res.status(200).json(getAllUsers);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  };