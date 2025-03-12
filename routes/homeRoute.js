const { Router } = require('express');
const homeRouter = Router();
const { getHomePage, upload, postUploadFile, postNewFolder } = require('../controller/homeController');
const { isAuth } = require('../lib/auth');



homeRouter.get('/', isAuth, getHomePage);
homeRouter.post('/', upload.single('upload-file'), postUploadFile);
homeRouter.post('/new-folder', postNewFolder);


module.exports = homeRouter;