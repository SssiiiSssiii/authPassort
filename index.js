const express = require('express');
const app = express();
const userRouter = require('./Routes/userRouter.js');
const mong = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const User = require('./Models/userModel.js');
const setUpPassport = require("./setupPassport");


setUpPassport();

require('dotenv').config();

app.use(session({
    resave: false,
    secret: process.env.SECRET,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRouter);


mong.connect(process.env.URI).then(() => { console.log("DB") });
app.listen(process.env.PORT ?? 3000);