const express = require('express');
const passport = require('passport');
const { loginSuccess, logoutUser } = require('../Controllers/Authcontroller');
const ensureAuthenticated = require('../Middlewares/authmiddlewares');



const router = express.Router();

// Initiate Google OAuth login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    scope:
['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/gmail.readonly'],
accessType: 'offline',
prompt: 'consent',
    failureRedirect: 'http://localhost:3001',
  }),
  (req, res) => {
    res.redirect('http://localhost:3001/home');
  }
);

// Logout route
router.get('/logout', logoutUser);

// Protected profile route
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Welcome, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});



module.exports = router;
