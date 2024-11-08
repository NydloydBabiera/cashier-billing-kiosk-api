const controller = require('../controllers/userInformationController')
const router = require('express').Router()

router.get('/',controller.getAllUsers)
router.post('/createUser', controller.addNewUser)
router.get('/getUserInformation/:id', controller.getUserPerRFID)

module.exports = router