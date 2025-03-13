const { Router } = require('express');
const homeRouter = Router();
const { getHomePage, upload, postUploadFile, postNewFolder, getFilesByFolder, deleteFolder } = require('../controller/homeController');
const { isAuth } = require('../lib/auth');



homeRouter.get('/', isAuth, getHomePage);
homeRouter.post('/', upload.single('upload-file'), postUploadFile);
homeRouter.post('/new-folder', postNewFolder);
homeRouter.post('/files', getFilesByFolder);
homeRouter.get('/delete/:id/:foldername', deleteFolder);

module.exports = homeRouter;