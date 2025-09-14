// const express = require('express');
// const passport = require('passport');
// const router = express.Router();

// // 1. The route to start the Google login process
// router.get('/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }));

// // 2. The callback route Google redirects to after login
// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//     // Successful authentication, redirect to the frontend.
//     res.redirect(process.env.CLIENT_URL);
// });

// // 3. A route to check the current user
// router.get('/current_user', (req, res) => {
//     res.send(req.user);
// });

// // 4. The route to logout
// router.get('/logout', (req, res, next) => {
//     req.logout((err) => {
//         if (err) { return next(err); }
//         res.redirect('http://localhost:5173');
//     });
// });

// module.exports = router;

// server/src/routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to initiate Google login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback route that Google redirects to
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-failed' }), (req, res) => {
    // --- DEBUG LOG #1 ---
    // This will show us if the user was successfully authenticated by Passport
    console.log('--- Google Callback Success ---');
    console.log('User object from Passport:', req.user);
    console.log('Session data:', req.session);
    console.log('-----------------------------');

    res.redirect(process.env.CLIENT_URL);
});

// Route to check for the current user session
router.get('/current_user', (req, res) => {
    // --- DEBUG LOG #2 ---
    // This will show us if the browser is correctly sending back the session cookie
    console.log('--- Checking /current_user ---');
    console.log('User object from session:', req.user);
    console.log('Is user authenticated?', req.isAuthenticated());
    console.log('----------------------------');

    res.send(req.user);
});

// Route for logging out
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;