const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/connection');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();


// User registration
router.post('/register', async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ error: err });
      }

      if (result.length > 0) {
        console.log('User already exists')
        return res.status(200).json({ error: 'User already exists' });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user into the database with default role 'user'
      db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, 'user'],
        (err) => {
          if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: err });
          }
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: err });
  }
});

// User login
router.post('/login', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: err });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const user = result[0];
    // Compare the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Save user info in session
    req.session.user = { id: user.id, username: user.name, email: user.email, role: user.role };
    res.status(200).json({ message: 'Login successful', user: req.session.user });
  });
});

// User logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});


// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const [user] = await db.promise().query(userQuery, [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    const updateQuery = `
      UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE email = ?
    `;
    await db.promise().query(updateQuery, [hashedToken, tokenExpiration, email]);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested to reset your password. Click <a href="${resetLink}">here</a> to reset it. This link will expire in 1 hour.</p>`,
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  console.log(req.body);

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const userQuery = `
      SELECT * FROM users WHERE resetToken = ? AND resetTokenExpires > NOW()
    `;
    const [user] = await db.promise().query(userQuery, [hashedToken]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = `
      UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?
    `;
    await db.promise().query(updateQuery, [hashedPassword, user[0].id]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Check session
router.get('/session', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// Admin routes for user management
// Get all users (admin only)
router.get('/admin/users', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  db.query('SELECT id, username, email, role, created_at FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json(results);
  });
});

// Update user role (admin only)
router.put('/admin/users/:userId/role', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId], (err) => {
    if (err) {
      console.error('Error updating user role:', err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'User role updated successfully' });
  });
});

// Delete user (admin only)
router.delete('/admin/users/:userId', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const { userId } = req.params;

  db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
