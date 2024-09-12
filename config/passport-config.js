const LocalStrategy = require("passport-local").Strategy;
const auth = require("./auth");

async function authenticateUser(email, password, done) {
  try {
    const user = await getUser(email);
    if (!user) {
      return done(null, false, { message: "Email does not exist." });
    }

    const result = await auth.compareHashes(password, user.password);
    if (!match) {
      return done(null, false, { message: "Invalid password." });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

function initializePassport(passport) {
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
}

module.exports = initializePassport;
