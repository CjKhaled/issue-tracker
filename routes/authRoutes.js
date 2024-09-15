const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')


router.post("/signup", controller.createNewUser)
router.post("/login", controller.loginExistingUser)
router.get('/logout', controller.logoutUser)

module.exports = router;