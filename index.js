const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRotuer');
const setUpPassport = require("./setuppassport");

require('dotenv').config();

mongoose.connect(process.env.URI).then(() => console.log('Connected!'));

setUpPassport();

app.use(express.json());

app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRouter);

app.listen(process.env.PORT ?? 3000);