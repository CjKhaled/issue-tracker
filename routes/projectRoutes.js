const express = require('express')
const router = express.Router()
const controller = require('../controllers/projectController')
const authenticateJWT = require("../middleware/auth")

// verify token
router.get("/projects", authenticateJWT, controller.getProjects)

module.exports = router;