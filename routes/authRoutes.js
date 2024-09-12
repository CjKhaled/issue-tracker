const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')

router.get("/signup", controller.getSignUpPage)
router.get("/login", controller.getLoginPage)
router.post("/signup", controller.createNewUser)
router.post("/login", controller.loginExistingUser)

module.exports = router;