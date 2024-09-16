const prisma = require("./prismaClient");

async function createANewProject(userId, title) {
  // if a user creates a project, they are an automatic admin
  try {
    const newProject = await prisma.project.create({
      data: {
        title: title,
        createdBy: {
          connect: {
            id: userId,
          },
        },
        projectUser: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
      },
      include: {
        projectUser: true,
      },
    });

    return newProject;
  } catch (error) {
    throw new Error(error);
  }
}

async function getProjectsForUser(userId) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        projectUser: {
          some: {
            userId: userId, // only get projects where this specific user is a part of
          },
        },
      },
      include: {
        projectUser: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return projects;
  } catch (error) {
    throw new Error("Error getting projects.");
  }
}

async function getProjectForUser(projectId) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        projectUser: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return project;
  } catch (error) {
    throw new Error(error);
  }
}

async function findExistingProjectUser(projectId, userId) {
  try {
    const projectUser = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
    });

    return projectUser;
  } catch (error) {
    throw new Error(error);
  }
}

async function addUserToProject(projectId, userId, role) {
  try {
    const projectUser = await prisma.projectUser.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: role,
      },
    });

    return projectUser;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  createANewProject,
  getProjectsForUser,
  getProjectForUser,
  findExistingProjectUser,
  addUserToProject,
};
