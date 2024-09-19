const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')
const authenticateJWT = require("../middleware/auth").authenticateJWT


router.post("/signup", controller.createNewUser)
router.post("/login", controller.loginExistingUser)
router.get('/logout', authenticateJWT, controller.logoutUser)

module.exports = router;