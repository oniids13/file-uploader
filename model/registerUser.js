const { PrismaClient }  = require('@prisma/client');
const prisma = new PrismaClient();



const registerUser =  async (username, email, salt, hash) => {

    const newUser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            salt: salt,
            hash: hash
        },
        select: {
            username: true,
            email: true
        }
    })

    return newUser
}


module.exports = {registerUser};