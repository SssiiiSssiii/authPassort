const express = require('express');
const User = require('../Models/userModel');
const passport = require('passport');
const path = require('path');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(path.resolve('public', 'login.html'));
});

router.get('/profile', (req, res) => {
    res.sendFile(path.resolve('public', 'profile.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.resolve('public', 'register.html'));
});

router.get('/data', ensureAuth, async (req, res) => {
    if (req.user[0].role === 'admin') {
        let users = await User.find();
        return res.json({ users });
    }
    return res.status(401).json({ MSG: "FORBIDD" });
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login'
}));


router.post('/register', async (req, res, next) => {
    const { email, password } = req.body;

    let isExist = await User.findOne({ email });
    if (isExist) return res.send("Choose another one.");

    let newUser = new User({ email, password });
    await newUser.save();
    next();

}, passport.authenticate('login', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login'
}));

router.post('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/users/login');
    });
});

function ensureAuth(req, res, next) {
    return req.isAuthenticated() ? next() : res.redirect('/users/login');
};

module.exports = router;