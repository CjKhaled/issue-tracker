const passport = require('passport')

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

module.exports = authenticateJWT