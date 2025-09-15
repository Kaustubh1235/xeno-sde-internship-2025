const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', (req, res, next) => {
  // This is the exact redirect_uri Google will receive (from the Strategy's callbackURL)
  // You can also hard-pass it below to eliminate any ambiguity.
  console.log('[OAUTH] Initiating Google OAuth. Expect callback at:',
              process.env.GOOGLE_REDIRECT_URI ||
              `${process.env.API_BASE_URL || 'https://xeno-sde-internship-2025.onrender.com'}/api/auth/callback/google`);

  return passport.authenticate('google', {
    scope: ['profile','email'],
    // Belt & suspenders: pass callbackURL here too
    callbackURL: process.env.GOOGLE_REDIRECT_URI ||
                 `${process.env.API_BASE_URL || 'https://xeno-sde-internship-2025.onrender.com'}/api/auth/callback/google`,
  })(req, res, next);
});

router.get('/callback/google',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login-failed`,
    session: true
  }),
  (req, res) => res.redirect(process.env.CLIENT_URL)
);

router.get('/current_user', (req, res) => res.send(req.user || null));
router.get('/logout', (req, res, next) =>
  req.logout(err => err ? next(err) : res.redirect(process.env.CLIENT_URL))
);

module.exports = router;
