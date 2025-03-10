const { Router } = require('express');
const loginRouter = Router();
const { getLogin, postLogin } = require('../controller/loginController');



loginRouter.get('/', getLogin);
loginRouter.post('/', postLogin)



module.exports = loginRouter;