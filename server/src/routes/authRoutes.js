const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login-failed`,
    session: true,
  }),
  (req, res) => {
    // success
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get('/current_user', (req, res) => res.send(req.user || null));

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;
