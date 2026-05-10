const express = require('express');
const { sequelize } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/packing?trip_id=X
router.get('/', authMiddleware, async (req, res) => {
  const { trip_id } = req.query;
  if (!trip_id) return res.status(400).json({ message: 'trip_id required' });
  try {
    const [rows] = await sequelize.query(
      'SELECT * FROM packing_items WHERE trip_id = ? ORDER BY category, name',
      { replacements: [trip_id] }
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/packing
router.post('/', authMiddleware, async (req, res) => {
  const { trip_id, name, category } = req.body;
  if (!trip_id || !name) return res.status(400).json({ message: 'trip_id and name required' });
  try {
    const [result] = await sequelize.query(
      'INSERT INTO packing_items (trip_id, name, category) VALUES (?, ?, ?)',
      { replacements: [trip_id, name, category || 'misc'] }
    );
    const [item] = await sequelize.query('SELECT * FROM packing_items WHERE id = ?', { replacements: [result] });
    res.status(201).json(item[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/packing/:id/toggle
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    await sequelize.query(
      'UPDATE packing_items SET is_packed = NOT is_packed WHERE id = ?',
      { replacements: [req.params.id] }
    );
    const [item] = await sequelize.query('SELECT * FROM packing_items WHERE id = ?', { replacements: [req.params.id] });
    res.json(item[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/packing/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM packing_items WHERE id = ?', { replacements: [req.params.id] });
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/packing/reset/:trip_id
router.delete('/reset/:trip_id', authMiddleware, async (req, res) => {
  try {
    await sequelize.query('UPDATE packing_items SET is_packed = 0 WHERE trip_id = ?', { replacements: [req.params.trip_id] });
    res.json({ message: 'Checklist reset' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
