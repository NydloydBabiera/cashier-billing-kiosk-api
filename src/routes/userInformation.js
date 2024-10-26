const controller = require('../controllers/userInformationController')
const router = require('express').Router()

router.get('/',controller.getAllUsers)

module.exports = router