const userRouter = require('express').Router();
const User = require('../models/userModel');
const passport = require('passport');
const path = require('path');

userRouter.get('/data', ensureAuth, async (req, res) => {
    if (req.user.role == 'admin') {
        let users = await User.find();
        return res.json({ users });
    }
    return res.status(401).json({ MSG: "NOT AUTH" });
});

userRouter.get('/signIn', (req, res) => {
    res.render('signIn');
});

userRouter.get('/signIn/success', (req, res) => {
    res.render('home', { name: req.user.email });
});

userRouter.get('/reg', (req, res) => {
    res.render('signup');
});

userRouter.post('/reg', async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ERROR: "PLS complete the info!" });
    }

    let isExist = await User.findOne({ email });
    if (isExist) return res.json({ msg: "The Email already exists" });

    const newUser = new User({
        email,
        password,
        role
    })
    await newUser.save();

    next();
}, passport.authenticate("signIn", {
    successRedirect: '/users/home',
    failureRedirect: '/users/signIn/fail'
}));


userRouter.post('/signIn', passport.authenticate('signIn', {
    successRedirect: '/users/signIn/success',
    failureRedirect: '/users/signIn/fail'
}));


userRouter.route('/signIn/fail').get((req, res) => {
    res.status(401).json({ MSG: "لف وأرجع تاني" });
})


userRouter.get('/home', (req, res) => {
    res.render('home', { name: req.user.email })
}
)

userRouter.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/users/home');
    });
});

function ensureAuth(req, res, next) {
    return req.isAuthenticated() ? next() : res.redirect('/users/signIn/fail');
};

module.exports = userRouter;