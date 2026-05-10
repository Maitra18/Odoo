const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/trips  — all trips for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT t.*,
        (SELECT COUNT(*) FROM stops WHERE trip_id = t.id) AS stop_count,
        (SELECT COALESCE(SUM(amount),0) FROM budget_entries WHERE trip_id = t.id) AS total_budget
       FROM trips t WHERE t.user_id = ? ORDER BY t.created_at DESC`,
      { replacements: [req.user.id] }
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/trips
router.post('/', authMiddleware, async (req, res) => {
  const { name, start_date, end_date, description, cover_photo, is_public } = req.body;
  if (!name) return res.status(400).json({ message: 'Trip name required' });
  try {
    const token = uuidv4().replace(/-/g, '');
    const [result] = await sequelize.query(
      `INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo, is_public, public_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      { replacements: [req.user.id, name, start_date || null, end_date || null, description || '', cover_photo || null, is_public ? 1 : 0, token] }
    );
    const [trip] = await sequelize.query('SELECT * FROM trips WHERE id = ?', { replacements: [result] });
    res.status(201).json(trip[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/trips/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      'SELECT * FROM trips WHERE id = ? AND user_id = ?',
      { replacements: [req.params.id, req.user.id] }
    );
    if (!rows.length) return res.status(404).json({ message: 'Trip not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/trips/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, start_date, end_date, description, cover_photo, is_public } = req.body;
  try {
    await sequelize.query(
      `UPDATE trips SET name=?, start_date=?, end_date=?, description=?, cover_photo=?, is_public=? WHERE id=? AND user_id=?`,
      { replacements: [name, start_date, end_date, description, cover_photo, is_public ? 1 : 0, req.params.id, req.user.id] }
    );
    res.json({ message: 'Trip updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/trips/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM trips WHERE id = ? AND user_id = ?', { replacements: [req.params.id, req.user.id] });
    res.json({ message: 'Trip deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/trips/public/:token  — public shared view
router.get('/public/:token', async (req, res) => {
  try {
    const [trips] = await sequelize.query(
      `SELECT t.*, u.name AS author_name FROM trips t
       JOIN users u ON t.user_id = u.id
       WHERE t.public_token = ? AND t.is_public = 1`,
      { replacements: [req.params.token] }
    );
    if (!trips.length) return res.status(404).json({ message: 'Itinerary not found or not public' });
    const trip = trips[0];
    const [stops] = await sequelize.query(
      'SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index',
      { replacements: [trip.id] }
    );
    for (const stop of stops) {
      const [acts] = await sequelize.query(
        'SELECT * FROM activities WHERE stop_id = ? ORDER BY time_of_day',
        { replacements: [stop.id] }
      );
      stop.activities = acts;
    }
    trip.stops = stops;
    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
