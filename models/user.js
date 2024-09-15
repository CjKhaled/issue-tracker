const prisma = require("./prismaClient");

async function createNewUser(first, last, email, password) {
  try {
    const user = await prisma.user.create({
      data: {
        firstName: first,
        lastName: last,
        email: email,
        password: password,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error creating new user.");
  }
}

async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error finding user");
  }
}

async function findUserByID(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error finding user");
  }
}

module.exports = {
  createNewUser,
  findUserByEmail,
  findUserByID,
};
