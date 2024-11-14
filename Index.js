require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors=require('cors')
const uploadRoutes = require('./Routes/Routes');


require('./Config/Passport');


const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: 'http://localhost:3001', // Allow requests only from your React frontend
    credentials: true,               // Allow credentials (cookies, sessions)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers if needed
  })
);
// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use('/', uploadRoutes);

// Google OAuth Routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope:
    ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://mail.google.com'],
    accessType: 'offline',
    prompt: 'consent'})
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google',{scope:
    ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/gmail.readonly'],
    accessType: 'offline',
    prompt: 'consent',
    failureRedirect: '/',
  }
  ),
  (req, res) => {
    res.redirect('http://localhost:3001/home');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/profile', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.send(`<h1>Welcome, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
