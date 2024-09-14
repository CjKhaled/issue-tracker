const passport = require("passport");
const auth = require("../config/authUtils");

async function createNewUser(req, res, next) {
    // hash password
  try {
    const hashedPassword = await auth.hashPassword(req.body.password);
    const { firstName, lastName, email } = req.body;

    // push into database, then get the user so we can give JWT

    const user = await getUser()

    const jwt = auth.issueJWT(user);

    // most secure way to send JWT, make sure Bearer prefix is not added
    res.cookie('token', jwt.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
    })

    res.status(200).json({ success: true, user: user, message: "User created. Auto login..." })

  } catch (err){
    next(err)
  }
}

async function loginExistingUser(req, res, next) {
    try {
        const user = await getUSer()

        if (!user) {
            res.status(401).json({ success: false, message: "could not find user"})
        }
        
        // assume user is logged out, so they do not have a JWT yet
        const result = await auth.compareHashes(req.body.password, user.password)

        if (result) {
            const jwt = auth.issueJWT(user)
            res.cookie('token', jwt.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 8 * 60 * 60 * 1000 // 8 hours
            })    
            res.status(200).json({ success: true, user: user, message: "You've successfully logged in!" })
        } else {
            res.status(401).json({ success: false, message: "You entered the wrong password."})
        }
    } catch (err) {
        next(err)
    }
    
}

module.exports = {
  getLoginPage,
  getSignUpPage,
  createNewUser,
  loginExistingUser,
};
