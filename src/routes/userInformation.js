const controller = require('../controllers/userInformationController')
const router = require('express').Router()

router.get('/getAllUsers',controller.getAllUsers)
router.post('/createUser', controller.addNewUser)
router.get('/getUserInformation/:id', controller.getUserPerRFID)
router.post('/authenticateUser', controller.authenticateUser)
router.put('/updatePassword/:id', controller.updatePassword)

module.exports = router