const projectDB = require("../models/project")

async function getProjects(req, res, next) {
    try {
        const projects = await projectDB.getProjectsForUser(req.user.id)
        res.status(200).json({success: true, user: req.user, projects: projects, message: 'Successfully grabbed all your projects!'})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function createProject(req, res, next) {
    try {
        const {title} = req.body
        const newProject = await projectDB.createANewProject(req.user.id, title)
        res.status(200).json({ success: true, user: req.user, projectCreated: newProject, message: 'Successfully created new project!'})
    } catch (error) {
        console.log(error)
        next(error)
    }
    
}

function addUserToProject(req, res, next) {}

module.exports = {
    getProjects,
    createProject
}