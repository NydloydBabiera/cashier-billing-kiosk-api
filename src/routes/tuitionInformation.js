const controller = require('../controllers/tuitionInfromationController')
const router = require('express').Router()

router.post('/addStudentTuition',controller.addStudentTuition)
router.get('/getStudentTuition/:id',controller.tuitionDetails)
router.get('/getAllStudentTuition',controller.getAllStudentTuition)

module.exports = router