const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../lib/passwordUtil');
const { PrismaClient }  = require('@prisma/client');
const { hash } = require('bcryptjs');
const prisma = new PrismaClient();


const verifyCallback = async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id:true,
                username: true,
                email: true,
                salt: true,
                hash: true
            }
        })

        console.log(user)
        if (!user) {
            console.log("User not found");
            return done(null, false, {message: 'User not found'});
        }

        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
            return done(null, user);
        } else {
            console.log('Incorrect Password');
            return done(null, false, { message: 'Incorrect Password' });
        }
    }
    catch (err) {
        console.error(err);
        return done(err);
    }
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done (null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            return done(null, false);
        }
        return done(null, user)
    } catch(err) {
        done(err);
    }
})