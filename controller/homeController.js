const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({storage:storage})


const getHomePage = (req, res) => {
    return res.render('home', {file: null});
}

const postUploadFile = (req, res) => {
    if(!req.file) {
        const noFile = 'No File Uploaded.'
        return res.render('home', {file: noFile});
    } else {
        const file = ' File Uploaded!'
        return res.render('home', {file})
    }
}

module.exports = { getHomePage, upload, postUploadFile };