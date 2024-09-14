const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/userModel')
const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ERROR: "PLS complete the info!" });

    let isExist = await User.findOne({ email });
    if (isExist) return res.json({ msg: "The Email already exists" });

    const newUser = new User({
        email,
        password
    })
    await newUser.save();

    next();
}, passport.authenticate("login", {
    successRedirect: '/users',
    failureRedirect: '/users/login/fail'
}));

router.post('/login', passport.authenticate("login", {
    successRedirect: '/users',
    failureRedirect: "/users/login/fail"
}));

router.post('/login/fail', (req, res) => {
    res.status(401).json({ ERROR: 'الأندر تيكر مش عاجبه الكلام دا' });
});

router.post('/', (req, res) => {
    res.send("عدي يمعلم")
});

router.get('/testReg', ensureAuthenticated, (req, res) => {
    res.send("تمام")
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/users/login/fail");
    }
}

module.exports = router;