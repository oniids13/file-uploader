const { Router } = require('express');
const homeRouter = Router();
const { getHomePage, upload, postUploadFile, postNewFolder, getFilesByFolder, deleteFolder, deleteFile } = require('../controller/homeController');
const { isAuth } = require('../lib/auth');



homeRouter.get('/', isAuth, getHomePage);
homeRouter.post('/', upload.single('file'), postUploadFile);
homeRouter.post('/new-folder', postNewFolder);
homeRouter.post('/files', getFilesByFolder);
homeRouter.post('/delete-folder', deleteFolder);
homeRouter.post('/delete-file', deleteFile);

module.exports = homeRouter;