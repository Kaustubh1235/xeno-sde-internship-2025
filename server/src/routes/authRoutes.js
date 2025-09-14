const express = require('express');
const passport = require('passport');
const router = express.Router();

// 1. The route to start the Google login process
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// 2. The callback route Google redirects to after login
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    // Successful authentication, redirect to the frontend.
    res.redirect(process.env.CLIENT_URL);
});

// 3. A route to check the current user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});

// 4. The route to logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('http://localhost:5173');
    });
});

module.exports = router;