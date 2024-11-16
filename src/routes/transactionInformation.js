const controller = require('../controllers/transactionInformationController')
const router = require('express').Router()

router.post('/addTuitionPayment',controller.addTuitionPayment)
router.get('/getAllTransactions',controller.getAllTransactions)
router.get('/paymentHistory/:id',controller.getPaymentPerStudent)

module.exports = router
