const { Router } = require('express');
const homeRouter = Router();
const { getHomePage, upload, postUploadFile, postNewFolder, getFilesByFolder, deleteFolder, deleteFile } = require('../controller/homeController');
const { isAuth } = require('../lib/auth');



homeRouter.get('/', isAuth, getHomePage);
homeRouter.post('/', postUploadFile);
homeRouter.post('/new-folder', postNewFolder);
homeRouter.post('/files', getFilesByFolder);
homeRouter.get('/delete/:id/:foldername', deleteFolder);
homeRouter.get('/delete', deleteFile);

module.exports = homeRouter;