const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all notes for a specific user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  db.query('SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching notes:', err.message);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Add a new note
router.post('/', (req, res) => {
  console.log(req.body);
  db.query('INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
    [req.body.title,req.body.content,req.body. user_id],
    (err, results) => {
      if(err){
        res.status(500).json("Mysql Server Error");
      }else{
        res.status(201).json({ id: results.insertId });
      }
    }
  )
});

// Edit a note
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content, id],
    (err) => {
      if (err) {
        console.error('Error updating note:', err.message);
        return res.status(500).json({ error: 'Failed to update note' });
      }
      res.status(200).json({ message: 'Note updated successfully' });
    }
  );
});

// Delete a note
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM notes WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting note:', err.message);
      return res.status(500).json({ error: 'Failed to delete note' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  });
});

module.exports = router;
