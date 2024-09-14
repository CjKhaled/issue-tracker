const fs = require('fs')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const publicKey = fs.readFileSync(__dirname + '/keys/public.key', 'utf8')

// expecting JWT to come from cookie
function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token']
  }

  return token
} 

// passing public key, since this is 'verify' part of our JWT process
const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: publicKey,
  algorithms: ['RS256']
}

// payload subfield should contain id of user
const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await getUser(payload.sub)
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }

  } catch (err) {
    return done(err, null)
  }
})

module.exports = (passport) => {
  passport.use(strategy)
};
