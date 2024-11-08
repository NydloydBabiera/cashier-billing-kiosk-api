const controller = require('../controllers/transactionInformationController')
const router = require('express').Router()

router.post('/addTuitionPayment',controller.addTuitionPayment)
router.get('/getAllTransactions',controller.getAllTransactions)

module.exports = router
