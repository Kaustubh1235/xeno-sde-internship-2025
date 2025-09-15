// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

const FE = process.env.CLIENT_URL;

router.get(
  '/google',
  (req, _res, next) => { console.log('START GOOGLE OAUTH'); next(); },
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile'], // include openid
    prompt: 'consent',
  })
);

router.get(
  '/callback/google',
  passport.authenticate('google', {
    failureRedirect: `${FE}/login-failed`,
    session: true,
  }),
  (req, res) => res.redirect(FE)
);

router.get('/current_user', (req, res) => res.send(req.user || null));

router.get('/logout', (req, res, next) =>
  req.logout(err => err ? next(err) : res.redirect(FE))
);

module.exports = router;
