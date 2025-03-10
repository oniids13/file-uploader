const express = require('express');
const session = require('express-session');
var passport = require('passport');
const path = require('node:path');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const indexRouter = require('./routes/indexRoute');


require('dotenv').config();


const app = express();
const assetPath = path.join(__dirname, 'public');


app.use(express.static(assetPath));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


// Session setup
app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    secret: 'pussycat',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
}));

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', indexRouter);

app.listen(3000, () => {
    console.log('http://localhost:3000');
});