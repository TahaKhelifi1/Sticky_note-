const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');

const app = express();

// Middleware to handle sessions
app.use(
  session({
    secret: "aabbcc",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false , // Secure in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    credentials: true, // Allow sending cookies
  })
);
app.use(bodyParser.json());

// Routes
app.use('/notes', notesRoutes);
app.use('/auth', authRoutes);
app.use('/settings', settingsRoutes);

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
