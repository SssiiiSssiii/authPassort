const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

function doWork() {
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });


    passport.deserializeUser(async function (id, done) {
        let user = await User.findById({ _id: id });
        done(null, user);
    });

    passport.use("signIn", new localStrategy({ usernameField: 'email' },
        async function (email, password, done) {
            let user = await User.findOne({ email });

            if (!user) return done(null, false);


            let isMatch = await user.checkPassword(password);
            return isMatch ? done(null, user) : done(null, false);
        }))
}

module.exports = doWork;