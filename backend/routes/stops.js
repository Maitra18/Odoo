const express = require('express');
const { sequelize } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/stops?trip_id=X
router.get('/', authMiddleware, async (req, res) => {
  const { trip_id } = req.query;
  if (!trip_id) return res.status(400).json({ message: 'trip_id required' });
  try {
    const [stops] = await sequelize.query(
      'SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index',
      { replacements: [trip_id] }
    );
    for (const stop of stops) {
      const [acts] = await sequelize.query(
        'SELECT * FROM activities WHERE stop_id = ? ORDER BY time_of_day',
        { replacements: [stop.id] }
      );
      stop.activities = acts;
    }
    res.json(stops);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/stops
router.post('/', authMiddleware, async (req, res) => {
  const { trip_id, city, country, arrival_date, departure_date, order_index } = req.body;
  if (!trip_id || !city) return res.status(400).json({ message: 'trip_id and city required' });
  try {
    const [result] = await sequelize.query(
      `INSERT INTO stops (trip_id, city, country, arrival_date, departure_date, order_index)
       VALUES (?, ?, ?, ?, ?, ?)`,
      { replacements: [trip_id, city, country || '', arrival_date || null, departure_date || null, order_index || 0] }
    );
    const [stop] = await sequelize.query('SELECT * FROM stops WHERE id = ?', { replacements: [result] });
    res.status(201).json(stop[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/stops/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { city, country, arrival_date, departure_date, order_index } = req.body;
  try {
    await sequelize.query(
      'UPDATE stops SET city=?, country=?, arrival_date=?, departure_date=?, order_index=? WHERE id=?',
      { replacements: [city, country, arrival_date, departure_date, order_index, req.params.id] }
    );
    res.json({ message: 'Stop updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/stops/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM stops WHERE id = ?', { replacements: [req.params.id] });
    res.json({ message: 'Stop deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
