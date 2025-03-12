const multer = require('multer');
const path = require('path');
const { createFolder, getFolderByUser } = require('../model/prismaQueries');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = req.body.foldername;
        const userId = req.user.id;
        if (!folderName) {
            return cb(new Error('Choose a folder'), null);
        }

        const uploadPath = `public/files/${userId}/${folderName}`;

        fs.mkdir(uploadPath, { recursive: true}, (err) => {
            if (err) return cb(err);
            cb(null, uploadPath);
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({storage:storage})


const getHomePage = async (req, res) => {
    const folders =  await getFolderByUser(req.user.id);
    return res.render('home', {file: null, folders: folders});
}

const postUploadFile = async (req, res) => {
    const folders =  await getFolderByUser(req.user.id);
    if(!req.file) {
        const noFile = 'No File Uploaded.'
        return res.render('home', {file: noFile, folders: folders});
    } else {
        const file = ' File Uploaded!'
        return res.render('home', {file, folders})
    }
}

const postNewFolder = async (req, res) => {
    const newFolder = req.body.newFolder;
    createFolder(newFolder, req.user.id);
    res.redirect('/home');
}


module.exports = { getHomePage, upload, postUploadFile, postNewFolder };