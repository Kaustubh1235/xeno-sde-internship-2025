const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
        proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
        // This function is called after the user logs in with Google
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // User already exists
                done(null, user);
            } else {
                // Create a new user
                user = await new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                }).save();
                done(null, user);
            }
        } catch (err) {
            done(err, null);
        }
    })
);