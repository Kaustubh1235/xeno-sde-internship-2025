const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const callbackURL =
  process.env.GOOGLE_REDIRECT_URI ||
  `${process.env.API_BASE_URL || 'http://localhost:8000'}/api/auth/google/callback`;

console.log('[OAUTH] Using callbackURL:', callbackURL);
console.log('[OAUTH] ClientID prefix:', (process.env.GOOGLE_CLIENT_ID || '').slice(0, 16));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL,   // absolute
    proxy: true,   // respect x-forwarded-proto on Render
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = { googleId: profile.id, email: profile.emails?.[0]?.value };
      return done(null, user);
    } catch (e) { return done(e); }
  }
));
