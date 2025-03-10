const {registerUser} = require('../model/registerUser');
const {body, validationResult} = require('express-validator');
const {genPassword} = require('../lib/passwordUtil');


const alphaErr = 'must only contain letter and number';
const emailErr = 'must containe @ and ends with .com';
const passLenght = 'must be greater than 6 characters and less than 20 characters';


const validateUser = [
    body('username').trim()
        .isAlphanumeric().withMessage(`Username ${alphaErr}`),
    body('email').trim()
        .isEmail().withMessage(`Email ${emailErr}`),
    body('password').trim()
        .isLength({min: 6, max: 20}).withMessage(`Password ${ passLenght }`)
]



const getForm = (req, res) => {
    return res.render('registerForm', {error: null});
}


const addUser = [validateUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorsArray = errors.array();

        return res.render('registerForm', {error: errorsArray});
    }

    try {
        const { username, email, password } = req.body;

        const saltHash = genPassword(password);

        const salt = saltHash.salt;
        const hash = saltHash.hash;

        registerUser(username, email, salt, hash);

        return res.redirect('/login');
    } catch (err) {
        console.error('Database Error: ', err);
        return res.status(500).render('registerForm', {
            error: ['An error occurred while processing your request. Please try again.'],
            formData: req.body
        });
    }
}]



module.exports = {getForm, addUser};