const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/connection');


// Change Password
router.put('/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const userId = req.session.user.id;
    // Fetch the current password from the database
    const [rows] = await db.promise().query('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the password in the database
    await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the password' });
  }
});


// Change Username
router.put('/username', async (req, res) => {
    const { newUsername } = req.body;
    console.log(newUsername);
    db.query('SELECT id FROM users WHERE name = ?', [newUsername],(err1,result1)=>{
      if(err1)res.status(400).json({message : "Message Error"});
      if(result1.length <= 0){
        db.query('UPDATE users SET name = ? WHERE id = ?', [newUsername, req.session.user.id],(err2,result2)=>{
          req.session.user.username = newUsername;
          if(err2)res.status(400).json({message : "Message Error"});
          res.status(200).json({message : "Username Updated Successfuly"});
        })
      }else res.status(400).json({message : "Username Already Used"});
        
    });
});

module.exports = router;