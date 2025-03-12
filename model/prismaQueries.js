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

const createFolder = async(folderName, userId) => {
    try {
        const newFolder = await prisma.folder.create({
            data: {
                foldername: folderName,
                userId: userId
            },
            select: {
                id: true,
                foldername: true,
                userId: true,
            }
        });
        console.log('Folder Created Successfully: ', newFolder);
        return newFolder;
    } catch (err) {
        console.error('Error creating folder: ', err);
        throw err;
    }
};


const getFolderByUser = async(userId) => {
    try {
        const folders = await prisma.folder.findMany({
            where: {
                userId: userId
            },
            select: {
                foldername: true,
            }
        })
        return folders;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {registerUser, createFolder, getFolderByUser};