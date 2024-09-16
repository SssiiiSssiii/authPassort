const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./Models/userModel');

function doWork() {

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(async function (id, done) {
        await User.find({ _id: id })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });

    passport.use('login', new localStrategy({
        usernameField: 'email'
    },
        async function (email, password, done) {
            let user = await User.findOne({ email });
            if (!user) return done(null, false);

            let isMatch = await user.checkPassword(password);
            if (isMatch) return done(null, user);
            return done(null, false);

        }
    ));
}

module.exports = doWork;