const issueDB = require("../models/issue")

async function getIssues(req, res, next) {
    try {
        const projectId = req.params.projectId
        const issues = await issueDB.getAllIssues(projectId)
        res.status(200).json({success: true, issues: issues, message: "Successfully retrieved all issues!"})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function createIssue(req, res, next) {
    try {
        const { title, description, priority } = req.body
        const projectId = req.params.projectId
        const newIssue = await issueDB.createNewIssue(title, description, priority, projectId, req.user.id)
        res.status(200).json({success: true, issueCreated: newIssue, message: "Successfully created issue!"}) 
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function getIssue(req, res, next) {
    try {
        const issueId = req.params.ticketId
        const issue = await issueDB.getSingleIssue(issueId)
        res.status(200).json({success: true, issue: issue, message: "Successfully retrieved issue!"})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function updateIssue(req, res, next) {
    try {
        const {title, description, priority, status} = req.body
        const issueId = req.params.ticketId
        const projectId = req.params.projectId
        const updatedIssue = await issueDB.updateSingleIssue(title, description, priority, status, issueId, req.user.id, projectId)
        res.status(200).json({success: true, updatedIssue: updatedIssue, message: "Successfully updated issue!"})  
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function deleteIssue(req, res, next) {
    try {
        const issueId = req.params.ticketId
        const deletedIssue = await issueDB.deleteSingleIssue(issueId)
        res.status(200).json({success: true, deletedIssue: deletedIssue, message: "Successfully deleted issue!"})  
    } catch (error) {
        console.log(error)
        next(error)
    }
    
}

module.exports = {
    getIssue, 
    getIssues,
    createIssue,
    updateIssue,
    deleteIssue
}