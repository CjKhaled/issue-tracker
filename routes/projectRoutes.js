const express = require("express");
const router = express.Router();
const controller = require("../controllers/projectController");
const authenticateJWT = require("../middleware/auth");

router.get("/projects", authenticateJWT, controller.getProjects);
router.post("/projects", authenticateJWT, controller.createProject);
router.get("/projects/:projectId", authenticateJWT, controller.getProject);
router.post(
  "/projects/invite-user",
  authenticateJWT,
  controller.inviteUserToProject
);
router.post(
  "/projects/join-project/:token",
  authenticateJWT,
  controller.addUserToProject
);

module.exports = router;
