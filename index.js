const express = require('express');
const mong = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const userRouter = require('./Routes/userRouter');
const setUpPassport = require('./setupPassport');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));//Setting body-parser’s extended option to false makes the parsing simpler and more secure

mong.connect("mongodb://127.0.0.1:27017/App").then(console.log("Start DB"));
app.listen(3000, () => console.log("start server"));

setUpPassport();

app.use(session({
    secret: 'EcJzI4X9hVNSWbahOtQhI9PqQUsNGnKugZKMo3MN',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRouter);

