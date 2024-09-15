const express = require('express')
const router = express.Router()
const controller = require('../controllers/projectController')
const passport = require('passport')

// verify token
router.get("/projects", passport.authenticate('jwt', {session: false}), controller.getProjects)

module.exports = router;