const express = require('express')
const router = express.Router({mergeParams: true}) // to get projectId
const controller = require('../controllers/issueController')
const authenticateJWT = require("../middleware/auth").authenticateJWT
const setUserRole = require("../middleware/auth").setUserRole
const authorizeDelete = require("../middleware/auth").authorizeDelete
const authorizeUpdate = require("../middleware/auth").authorizeUpdate


router.get("/tickets", authenticateJWT, controller.getIssues)
router.post("/tickets", authenticateJWT, setUserRole, controller.createIssue)
router.get("/tickets/:ticketId", authenticateJWT, controller.getIssue)
router.put("/tickets/:ticketId", authenticateJWT, setUserRole, authorizeUpdate, controller.updateIssue)
router.delete("/tickets/:ticketId", authenticateJWT, setUserRole, authorizeDelete, controller.deleteIssue)

module.exports = router;