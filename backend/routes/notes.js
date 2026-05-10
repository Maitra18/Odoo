const express = require('express');
const { sequelize } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/notes?trip_id=X
router.get('/', authMiddleware, async (req, res) => {
  const { trip_id } = req.query;
  if (!trip_id) return res.status(400).json({ message: 'trip_id required' });
  try {
    const [rows] = await sequelize.query(
      `SELECT n.*, s.city AS stop_city FROM notes n
       LEFT JOIN stops s ON n.stop_id = s.id
       WHERE n.trip_id = ? ORDER BY n.created_at DESC`,
      { replacements: [trip_id] }
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/notes
router.post('/', authMiddleware, async (req, res) => {
  const { trip_id, stop_id, title, content } = req.body;
  if (!trip_id || !content) return res.status(400).json({ message: 'trip_id and content required' });
  try {
    const [result] = await sequelize.query(
      'INSERT INTO notes (trip_id, stop_id, title, content) VALUES (?, ?, ?, ?)',
      { replacements: [trip_id, stop_id || null, title || '', content] }
    );
    const [note] = await sequelize.query('SELECT * FROM notes WHERE id = ?', { replacements: [result] });
    res.status(201).json(note[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/notes/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    await sequelize.query(
      'UPDATE notes SET title=?, content=? WHERE id=?',
      { replacements: [title, content, req.params.id] }
    );
    res.json({ message: 'Note updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/notes/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM notes WHERE id = ?', { replacements: [req.params.id] });
    res.json({ message: 'Note deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
