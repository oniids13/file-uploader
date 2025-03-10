const { Router } = require('express');
const registerRouter = Router();
const {getForm, addUser} = require('../controller/registerController');


registerRouter.get('/', getForm);
registerRouter.post('/', addUser)



module.exports = registerRouter;