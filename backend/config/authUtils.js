const bycrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync(__dirname + "/keys/public.key", "utf8");
const privateKey = fs.readFileSync(__dirname + "/keys/private.key", "utf8");

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
  // used just for auth
  const id = user.id;
  const expiresIn = "8h";
  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, privateKey, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });
  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
}

function issueInviteJWT(user, projectId, role) {
  const payload = {
    subUser: user.id,
    subProject: projectId,
    role: role,
    iat: Date.now(),
    iss: "issue-tracker",
  };

  const signedToken = jsonwebtoken.sign(payload, privateKey, {
    expiresIn: "1h",
    algorithm: "RS256",
  });
  return {
    token: signedToken,
    expiresIn: "1h",
  };
}

function verifyJWT(token) {
  try {
    const decodedToken = jsonwebtoken.verify(token, publicKey, {
      issuer: "issue-tracker",
    });

    return decodedToken;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired.");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token.");
    } else {
      throw new Error("Token verification failed.");
    }
  }
}

module.exports = {
  hashPassword,
  compareHashes,
  issueJWT,
  verifyJWT,
  issueInviteJWT,
};
