const { Router } = require('express');
const homeRouter = Router();
const { getHomePage, upload, postUploadFile } = require('../controller/homeController');
const { isAuth } = require('../lib/auth');



homeRouter.get('/', isAuth, getHomePage);
homeRouter.post('/', upload.single('upload-file'), postUploadFile);


module.exports = homeRouter;