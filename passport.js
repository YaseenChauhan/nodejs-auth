const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.model');
const passwordUtil = require('./utils/password');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    console.log('local', email, password);

    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'user does not exist' });
        const isValid = await passwordUtil.validatePassword(password, user.password);
        if (isValid) {
            return done(null, user, { message: 'success' });
        } else {
            return done(null, false, { message: 'password does not match' });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser(function(user, cb) {
    console.log('serial', user);
    cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
    console.log('deserial', id);

    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

// module.exports = passport;