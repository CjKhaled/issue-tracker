const express = require('express')
const router = express.Router({mergeParams: true}) // to get projectId
const controller = require('../controllers/issueController')
const authenticateJWT = require("../middleware/auth")

router.get("/tickets", authenticateJWT, controller.getIssues)
router.post("/tickets", authenticateJWT, controller.createIssue)
router.get("/tickets/:ticketId", authenticateJWT, controller.getIssue)
router.put("/tickets/:ticketId", authenticateJWT, controller.updateIssue)
router.delete("/tickets/:ticketId", authenticateJWT, controller.deleteIssue)

module.exports = router;