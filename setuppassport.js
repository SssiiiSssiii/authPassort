const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/userModel');


function doWork() {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        await User.findById({ _id: id })
            .then(user => done(null, user))
            .catch(err => done(err));
    })
    passport.use("login", new LocalStrategy({
        usernameField: 'email',
    },
        async function (email, password, done) {
            let user = await User.findOne({ email });
            if (!user)
                return done(null, false);

            let isMatch = await user.checkPassword(password);
            if (!isMatch)
                return done(null, false);
            return done(null, user);
        }
    ));
}

module.exports = doWork;