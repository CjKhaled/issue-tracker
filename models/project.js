const prisma = require("./prismaClient")

async function createANewProject(userId, title) {
    // if a user creates a project, they are an automatic admin
    try {
        const newProject = await prisma.project.create({
            data: {
                title: title,
                createdBy: {
                    connect: {
                        id: userId
                    }
                },
                projectUser: {
                    create: {
                        userId: userId,
                        role: 'ADMIN'
                    },
                },
            },
            include: {
                projectUser: true
            },
        })

        return newProject
    } catch (error) {
        throw new Error(error)
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
        })

        return projects
    } catch (error) {
        throw new Error("Error getting projects.")
    }
}


module.exports = {
    createANewProject,
    getProjectsForUser
}