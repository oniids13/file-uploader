const { Router } = require('express');
const indexRouter = Router();
const {getIndex} = require('../controller/indexController');


indexRouter.get('/', getIndex);


module.exports = indexRouter;
