const projectDB = require("../models/project");
const userDB = require("../models/user");
const auth = require("../config/authUtils");

async function getProjects(req, res, next) {
  try {
    const projects = await projectDB.getProjectsForUser(req.user.id);
    res
      .status(200)
      .json({
        success: true,
        user: req.user,
        projects: projects,
        message: "Successfully grabbed all your projects!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function createProject(req, res, next) {
  try {
    const { title } = req.body;
    const newProject = await projectDB.createANewProject(req.user.id, title);
    res
      .status(200)
      .json({
        success: true,
        user: req.user,
        projectCreated: newProject,
        message: "Successfully created new project!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getProject(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const project = await projectDB.getProjectForUser(projectId);
    res
      .status(200)
      .json({
        success: true,
        user: req.user,
        project: project,
        message: "Successfully grabbed your project!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function inviteUserToProject(req, res, next) {
  try {
    // most likely, the person they invite will not have an account
    const user = await userDB.findUserByEmail(req.body.email);
    const projectId = req.params.projectId;
    const role = req.params.role;

    if (!user) {
      // they need to create an account
      return res
        .status(400)
        .json({
          success: false,
          message: "User needs to create an account before joining project.",
        });
    }

    // making sure they aren't already in project
    const projectUser = await projectDB.findExistingProjectUser(
      projectId,
      user.id
    );
    if (projectUser) {
      return res
        .status(400)
        .json({ success: false, message: "User is already in your project." });
    }

    // otherwise, craft the invite link
    const jwt = auth.issueInviteJWT(user, projectId, role);
    const inviteLink = `projects/join-project/${jwt.token}`;
    res
      .status(200)
      .json({
        success: true,
        inviteLink: inviteLink,
        message: "Successfully crafted invitation link!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function addUserToProject(req, res, next) {
  try {
    const { token } = req.params;
    const decodedToken = auth.verifyJWT(token);
    const { subProject: projectId, subUser: userId, role } = decodedToken;

    // if token is correct, we can add user to project
    const projectUser = await projectDB.addUserToProject(
      projectId,
      userId,
      role
    );
    return res
      .status(200)
      .json({
        success: true,
        projectUser: projectUser,
        message: "User has been added to the project!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  getProjects,
  createProject,
  getProject,
  inviteUserToProject,
  addUserToProject,
};
