const bycrypt = require("bcrypt");
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const privateKey = fs.readFileSync(__dirname + '/keys/private.key', 'utf8')

async function hashPassword(password) {
  try {
    const hashedPassword = await bycrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
}

async function compareHashes(givenPassword, storedPassword) {
  try {
    const result = await bycrypt.compare(givenPassword, storedPassword);
    return result;
  } catch (err) {
    throw err;
  }
}

function issueJWT(user) {
    const id = user.id
    const expiresIn = '8h'
    const payload = {
        sub: id,
        iat: Date.now()
    }

    const signedToken = jsonwebtoken.sign(payload, privateKey, {expiresIn: expiresIn, algorithm: 'RS256'})
    // make sure format is correct for extracting the token
    return {
        token: signedToken,
        expiresIn: expiresIn
    }
}

module.exports = {
  hashPassword,
  compareHashes,
  issueJWT
};
