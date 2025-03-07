const controller = require("../controllers/examTermController")
const router = require("express").Router();

router.post("/examTerm", controller.addOrUpdateExamTerm)
router.get("/getCurrentTerm", controller.fetchCurrentTerm)

module.exports = router