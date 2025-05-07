const { where, Sequelize } = require("sequelize");
const dbConn = require("../data-access/dbConnection");
const { UserIdentification, UserInformation } = require("../models");
const StudentTuitionDetails = require("../models/StudentTuitionDetails");
const TuitionPaymentTransactions = require("../models/TuitionPaymentTransactions");
const dotenv = require("dotenv");
const { format } = require("date-fns")
const escpos = require('escpos');
const USB = require('escpos-usb');
// const SerialPort = require('escpos-serialport');
// escpos.SerialPort = require('escpos-serialport');
// escpos.USB = require('escpos-usb');
const examTerm = require("./examTermController")

dotenv.config();



const addTuitionPayment = async (req, res) => {
  const currentTerm = await examTerm.getExamTerm()
  const createPayment = await dbConn.transaction();
  const {
    amt,
    student_tuition_id,
    isPromiPayment,
    amount_due,
    remarks,
    isApproved,
  } = req.body;
  const transCnt = (await TuitionPaymentTransactions.count()) + 1;
  const transactionDetails = {
    transaction_code: `DOC${transCnt
      .toString()
      .padStart(3 + transCnt.toString().length, "0")}`,
    transaction_date: new Date(),
    amt_paid: amt,
    student_tuition_id,
    exam_type: currentTerm.dataValues.exam_term,
    isPromiPayment,
    amount_due,
    remarks,
    isApproved,
  };
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

const getSpecificTransaction = async (req, res) => {

  const transactionId = req.params.id
  await TuitionPaymentTransactions.findAll({
    where: {
      tuition_payment_transaction_id: {
        [Sequelize.Op.eq]: transactionId,
      },
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
                as: "information",
              }
            ]
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
}

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
const promisoryApproval = async (req, res) => {
  const { isApproved, remarks } = req.body;
  const transaction_id = req.params.id;
  try {
    await TuitionPaymentTransactions.update(
      {
        isApproved,
        remarks,
      },
      {
        where: {
          tuition_payment_transaction_id: transaction_id,
        },
      }
    )
      .then((apporove) => {
        return res.json(apporove);
      })
      .catch((error) => {
        res.json(error);
        console.error(error);
      });
  } catch (error) {
    res.json(err);
  }
};

const printReceipt = async (req, res) => {
  const trans_id = req.params.id;

  await TuitionPaymentTransactions.findOne({
    where: {
      tuition_payment_transaction_id: { [Sequelize.Op.eq]: trans_id }
    },
    include: [{
      model: StudentTuitionDetails,
      as: "tuition",
      include: [{
        model: UserIdentification,
        as: "student",
        include: [{
          model: UserInformation,
          as: "information"

        }]
      }]
    }]
  }).then((details) => {
    const data = {
      name: details.tuition.student.information.lastName.toUpperCase() + ','
        + details.tuition.student.information.firstName.toUpperCase()
        // .split(" ")
        // .map((word) => word[0])
        // .join("")
        + '.' + details.tuition.student.information.middleName
          .split(" ")
          .map((word) => word[0])
          .join("").toUpperCase(),
      exam_term: details.exam_type,
      due: details.amount_due,
      amt_paid: details.amt_paid,
      id_no: details.tuition.student.id_number,
      promisory: details.isPromiPayment,
      pmtDate: format(new Date(details.createdAt), "MMM dd,yyyy hh:mm:ss")
    }

    console.log(data)
    const device = new USB(); // Auto-detects USB printer
    // const device = new escpos.SerialPort('COM9'); 
    const printer = new escpos.Printer(device);
    device.open((err) => {
      if (err) {
        console.error('Failed to open serial port:', err);
        return;
      }
      // DIRI MAG CHANGE SANG RECEIPT DETAILS
      printer
        .align('ct')
        .size(2, 2)
        .text('Notre Dame of Tacurong College')
        .text('RFID-BACS System')
        .text('Payment Receipt')
        .text('----------------------------')
        .align('lt')
        .text('Student Details:')
        .text('')
        .text(`Name:${data.name}`)
        .text(`Exam:${data.exam_term}`)
        .text('')
        .text('Payment Details:')
        .text('')
        .text(`Due:${new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(data.due)}`)
        .text(`Amount paid:${new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(data.amt_paid)}`)
        .text(`Promi:${data.promisory ? 'YES' : 'NO'}`)
        .text(`Date:${data.pmtDate}`)
        .align('ct')
        .text('')
        .text(`${data.promisory ? 'NOTE: THIS IS A PROMISSORY \n PAYMENT PLEASE PROCEED TO THE \n TREASURY to process your \n promissory form.' : ''}`)
        .text('----------------------------')
        .text('')
        .text('')
        .close(() => {
          // First try normal close
          device.close((err) => {
            if (err) {
              console.error('Failed to close serial port:', err);

              // ✅ If close fails, force reset USB device to cancel pending requests
              console.warn('Trying to reset USB device to force-close...');
              const rawDevice = device.device;
              rawDevice.reset((resetErr) => {
                if (resetErr) {
                  console.error('Failed to reset USB device:', resetErr);
                  console.log('Force exiting process to release USB...');
                  process.exit(1); // hard kill (last resort)
                } else {
                  console.log('USB device reset successfully (forced stop).');
                }
              });

            } else {
              console.log('Serial port closed successfully.');
            }
          });
        });
    });
    if (!data.promisory)
      printPermit(data)
    return res.json(details);
  })
    .catch((error) => {
      res.json(error);
      console.error(error);
    });
}


const printPermit = (data) => {
  const device = new USB(); // Auto-detects USB printer

  const printer = new escpos.Printer(device);
  device.open((err) => {
    if (err) {
      console.error('Failed to open serial port:', err);
      return;
    }

    printer
      .align('ct')
      .size(2, 2)
      .text('Notre Dame of Tacurong College')
      .text('RFID-BACS System')
      .text('Student Permit')
      .text('----------------------------')
      .text('PERMIT TO TAKE THE:')
      .size(3, 3)
      .text(`${data.exam_term} EXAMINATION`)
      .text('----------------------------')
      .cut()
      .close();
  });
}


module.exports = {
  addTuitionPayment,
  getAllTransactions,
  getPaymentPerStudent,
  promisoryApproval,
  printReceipt,
  getSpecificTransaction
};
