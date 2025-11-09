// config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const CALLBACK =
  process.env.GOOGLE_REDIRECT_URI ||
  `${process.env.API_BASE_URL || 'http://localhost:8000'}/api/auth/callback/google`;

console.log('[OAUTH] callbackURL:', CALLBACK);

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.NODE_ENV === 'production'
  ? 'https://xeno-sde-internship-2025.onrender.com/api/auth/google/callback'
  : 'http://localhost:8000/api/auth/google/callback',
    proxy: true,
  },
  async (_at, _rt, profile, done) => {
    try {
      const user = { googleId: profile.id, email: profile.emails?.[0]?.value };
      return done(null, user);
    } catch (e) { return done(e); }
  }
));

passport.serializeUser((u, done) => done(null, u));
passport.deserializeUser((u, done) => done(null, u));
