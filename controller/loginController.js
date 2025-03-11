const passport = require('passport')

const getLogin = (req, res) => {
    return res.render('login', {error: null})
}

const postLogin = (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication Error: ', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication Failed');
            return res.render('login', {error: 'Incorrect Email/Password. Please try again.'})
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login Error: ', err);
                return next(err);
            }
            return res.redirect('/home');
        });
    })(req, res, next);
};

module.exports = { getLogin, postLogin };