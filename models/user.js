const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

async function createNewUser(first, last, email, password) {
    const user = await prisma.user.create({
        data: {
            firstName: first,
            lastName: last,
            email: email,
            password: password
        }
    })

    return user
}

async function findUserByEmail(email) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    return user
}

async function findUserByID(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    return user
}

module.exports = {
    createNewUser,
    findUserByEmail,
    findUserByID
}
