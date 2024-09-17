const { updateIssue } = require("../controllers/issueController");
const prisma = require("./prismaClient");

async function createNewIssue(title, description, priority, projectId, submitterId) {
    try {
        const newIssue = await prisma.issue.create({
            data: {
                title: title,
                description: description,
                priority: priority,
                status: 'OPEN',
                project: {
                    connect: {
                        id: projectId
                    }
                },
                submitter: {
                    connect: {
                        id: submitterId
                    }
                }
            }
        })

        return newIssue
    } catch (error) {
        throw new Error(error)
    }
}

async function getAllIssues(projectId) {
    try {
        const issues = await prisma.issue.findMany({
            where: {
                projectId: projectId
            },
            include: {
                submitter: true
            }
        })      
        
        return issues
    } catch (error) {
        throw new Error(error)
    }
}

async function getSingleIssue(issueId) {
    try {
        const issue = await prisma.issue.findUnique({
            where: {
                id: issueId
            },
            include: {
                submitter: true
            }
        })

        return issue
    } catch (error) {
        throw new Error(error)
    }
}

async function updateSingleIssue(title, description, priority, status, issueId, userId) {
    try {
        const updatedIssue = await prisma.issue.update({
            where: {
                id: issueId
            },
            data: {
                title: title,
                description: description, 
                priority: priority, 
                status: status,
                updatedBy: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return updatedIssue
    } catch (error) {
        throw new Error(error)
    }
}

async function deleteSingleIssue(issueId) {
    try {
        const deletedIssue = await prisma.issue.delete({
            where: {
                id: issueId
            }
        })

        return deletedIssue
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createNewIssue,
    getAllIssues, 
    getSingleIssue,
    updateSingleIssue,
    deleteSingleIssue
}