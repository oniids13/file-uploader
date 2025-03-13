const multer = require('multer');
const path = require('path');
const { createFolder, getFolderByUser, deleteFolderById } = require('../model/prismaQueries');
const fs = require('fs');
const { error } = require('console');


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
    
    return res.render('home', {file: null, folders: folders, error: null, files: []});
}

const postUploadFile = async (req, res) => {
    const folders =  await getFolderByUser(req.user.id);
    if(!req.file) {
        const noFile = 'No File Uploaded.'
        return res.render('home', {file: noFile, folders: folders, error: null, files: []});
    } else {
        const file = 'File Uploaded!'
        return res.render('home', {file, folders, error: null, files: []})
    }
}

const postNewFolder = async (req, res) => {
    try {
        const newFolder = req.body.newFolder;
        const folderPath = path.join(__dirname, newFolder)

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, {recursive: true});
            console.log('Folder created successfully');
        } else {
            console.log('Folder already exist.');
        }
        createFolder(newFolder, req.user.id);
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        throw err;
    }
    
}


const getFilesByFolder = async (req, res) => {
    const folders =  await getFolderByUser(req.user.id);
    const folderName = req.body.folders;
    const folderPath = path.join(__dirname, `../public/files/${req.user.id}/${folderName}`);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.render('home', {error: "No files yet. Upload a file to this folder.", files: folderName, folders, file: ''})
        }

        const fileUrls = files.map(file =>`${folderPath}/${file}`);
        const fileObj = {
            foldername: folderName,
            fileUrls: fileUrls
        }

        return res.render('home', {file: '', folders, error:null, files: fileObj})
    })
}

const deleteFolder = async (req, res) => {
    try {
        const folderPath = path.join(__dirname, '../public/files', req.user.id, req.params.foldername);

        if (fs.existsSync(folderPath)) {
            await fs.promises.rm(folderPath, {recursive: true, force:true});
        }
    

        await deleteFolderById(parseInt(req.params.id));
        return res.redirect('/home');
    } catch (err) {
        console.error(err);
        throw err;
    }
    
}

const deleteFile = async (req, res) => {
    try {
        const fileUrl = decodeURIComponent(req.query.file);
        
        if (fs.existsSync(fileUrl)) {
            fs.unlinkSync(fileUrl);
            console.log('File succesfully Deleted');
        } else {
            console.log('File not found');
        }



        return res.redirect('/home');
    } catch (err) {
        console.error(err);
        throw err;
    }
    
    
}

module.exports = { getHomePage, upload, postUploadFile, postNewFolder, getFilesByFolder, deleteFolder, deleteFile };