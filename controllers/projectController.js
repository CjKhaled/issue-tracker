const projectDB = require("../models/project")

async function getProjects(req, res, next) {
    try {
        const projects = await projectDB.getProjectsForUser(user.id)
        res.status(200).json({success: true, user: user, projects: projects, message: 'Successfully grabbed all your projects!'})
    } catch (error) {
        next(err)
    }
}

async function createProject(req, res, next) {
    try {
        const {title} = req.body
        const newProject = await projectDB.createANewProject(user.id, title)
        res.status(200).json({ success: true, user: user, projectCreated: newProject, message: 'Successfully created new project!'})
    } catch (error) {
        next(err)
    }
    
}

function addUserToProject(req, res, next) {}

module.exports = {
    getProjects,
    createProject
}