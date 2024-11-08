const dbConn = require("../data-access/dbConnection");
const { UserIdentification } = require("../models");
const StudentTuitionDetails = require("../models/StudentTuitionDetails");
const TuitionPaymentTransactions = require("../models/TuitionPaymentTransactions");

const addTuitionPayment = async (req, res) => {
  const createPayment = await dbConn.transaction();
  const {amt, student_tuition_id} = req.body
  const transCnt = await TuitionPaymentTransactions.count() + 1
  const transactionDetails = {
    transaction_code: `DOC${transCnt.toString().padStart(3 + transCnt.toString().length, '0')}`,
    transaction_date: new Date(),
    amt_paid: amt,
    student_tuition_id
  };

  console.log(transactionDetails)
  try {
    const addTransaction = await TuitionPaymentTransactions.create(
      transactionDetails,
      { transaction: createPayment }
    );
    await createPayment.commit();

    return res.status(200).json(addTransaction);
  } catch (error) {
    console.log(error)
    await createPayment.rollback();
    res.json(error);
  }
};

const getAllTransactions = async(req, res) =>{

    await TuitionPaymentTransactions.findAll({
        include:[
            {
                model: StudentTuitionDetails,
                as: 'tuition',
                include:[{
                    model: UserIdentification,
                    as: 'student'
                }]
            }
        ]
    }).then((transactions) =>{
        res.json(transactions)
    }).catch((error)=>{
        res.json(error)
    })

}

const countTransactions = () =>{

}


module.exports = {addTuitionPayment, getAllTransactions}