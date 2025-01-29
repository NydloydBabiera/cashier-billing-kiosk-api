const { Sequelize } = require("sequelize");
const dbConn = require("../data-access/dbConnection");

const ExamTerm = dbConn.define("exam_term", {
  exam_term: {
    type: Sequelize.STRING,
  },
});

module.exports = ExamTerm