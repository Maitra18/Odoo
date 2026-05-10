const express = require('express');
const { sequelize } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/activities?stop_id=X
router.get('/', authMiddleware, async (req, res) => {
  const { stop_id } = req.query;
  if (!stop_id) return res.status(400).json({ message: 'stop_id required' });
  try {
    const [rows] = await sequelize.query(
      'SELECT * FROM activities WHERE stop_id = ? ORDER BY time_of_day',
      { replacements: [stop_id] }
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/activities
router.post('/', authMiddleware, async (req, res) => {
  const { stop_id, name, type, cost, duration, description, image_url, time_of_day } = req.body;
  if (!stop_id || !name) return res.status(400).json({ message: 'stop_id and name required' });
  try {
    const [result] = await sequelize.query(
      `INSERT INTO activities (stop_id, name, type, cost, duration, description, image_url, time_of_day)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      { replacements: [stop_id, name, type || 'sightseeing', cost || 0, duration || 60, description || '', image_url || null, time_of_day || null] }
    );
    const [act] = await sequelize.query('SELECT * FROM activities WHERE id = ?', { replacements: [result] });
    res.status(201).json(act[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/activities/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, type, cost, duration, description, image_url, time_of_day } = req.body;
  try {
    await sequelize.query(
      'UPDATE activities SET name=?, type=?, cost=?, duration=?, description=?, image_url=?, time_of_day=? WHERE id=?',
      { replacements: [name, type, cost, duration, description, image_url, time_of_day, req.params.id] }
    );
    res.json({ message: 'Activity updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/activities/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM activities WHERE id = ?', { replacements: [req.params.id] });
    res.json({ message: 'Activity deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
