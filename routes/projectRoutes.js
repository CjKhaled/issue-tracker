const express = require('express')
const router = express.Router()
const controller = require('../controllers/projectController')
const authenticateJWT = require("../middleware/auth")

router.get("/projects", authenticateJWT, controller.getProjects)
router.post("/projects", authenticateJWT, controller.createProject)

module.exports = router;