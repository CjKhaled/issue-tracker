const passport = require('passport')
const projectDB = require("../models/project")

function authenticateJWT(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            return res.status(401).json({success: false, message: 'You are not authorized.'})
        }

        req.user = user
        next()
    })(req, res, next)
}

async function setUserRole(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const userId = req.user.id
        const project = await projectDB.getProjectForUser(projectId)
        const projectUser = project.projectUser.find(user => user.userId === userId)
        req.user.role = projectUser.role
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

function authorizeDelete(req, res, next) {
    if (req.user.role === "ADMIN" || req.user.role === "PROJECT_MANAGER") {
        next()
    }

    res.status(403).json({success: false, message: "You are not authorized to perform this action."})
}

function authorizeUpdate(req, res, next) {
    if (req.user.role === "ADMIN" || req.user.role === "PROJECT_MANAGER" || req.user.role === "DEVELOPER") {
        next()
    }

    res.status(403).json({success: false, message: "You are not authorized to perform this action."})
}

module.exports = {
    authenticateJWT,
    setUserRole,
    authorizeDelete,
    authorizeUpdate
}