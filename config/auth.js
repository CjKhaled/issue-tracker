// authentication strategies and hashing
const bycrypt = require("bcrypt");

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

module.exports = {
  hashPassword,
  compareHashes,
};
