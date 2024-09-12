const passport = require("passport");
const auth = require("../config/auth");

function getLoginPage(req, res) {
  res.json({
    message: "This is the login page",
  });
}

function getSignUpPage(req, res) {
  res.json({
    message: "This is the signup page",
  });
}

async function createNewUser(req, res) {
  try {
    const hashedPassword = await auth.hashPassword(req.body.password);
    const { firstName, lastName, email } = req.body;

    // push into database
    res.json({
      message: `You have created a user! ${firstName}, ${lastName}, ${email}, ${hashedPassword}`,
    });
  } catch {
    res.json({
      message: "error hashing password.",
    });
  }
}

async function loginExistingUser(req, res) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    // authentication failed
    if (!user) {
      res.json({ message: messages.error });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      // successful login
      return res.json({ message: "You have successfully logged in." });
    });
  })(req, res, next);
}

module.exports = {
  getLoginPage,
  getSignUpPage,
  createNewUser,
  loginExistingUser,
};
