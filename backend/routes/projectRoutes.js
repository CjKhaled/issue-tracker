const express = require("express");
const router = express.Router();
const controller = require("../controllers/projectController");
const authenticateJWT = require("../middleware/auth").authenticateJWT;
const setUserRole = require("../middleware/auth").setUserRole;
// doubles as invite authorize as well
const authorizeDelete = require("../middleware/auth").authorizeDelete;

router.get("/projects", authenticateJWT, controller.getProjects);
router.post("/projects", authenticateJWT, controller.createProject);
router.get(
  "/projects/:projectId",
  authenticateJWT,
  setUserRole,
  controller.getProject
);
router.post(
  "/projects/:projectId/invite-user",
  authenticateJWT,
  setUserRole,
  authorizeDelete,
  controller.inviteUserToProject
);
router.post(
  "/projects/join-project/:token",
  authenticateJWT,
  controller.addUserToProject
);

module.exports = router;
