const controller = require("../controllers/transactionInformationController");
const router = require("express").Router();

router.post("/addTuitionPayment", controller.addTuitionPayment);
router.get("/getAllTransactions", controller.getAllTransactions);
router.get("/paymentHistory/:id", controller.getPaymentPerStudent);
router.put("/promisoryApproval/:id", controller.promisoryApproval);
router.post("/printReceipt/:id", controller.printReceipt);
router.get("/getSpecificTransaction/:id", controller.getSpecificTransaction);

module.exports = router;
