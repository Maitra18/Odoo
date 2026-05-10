const express = require('express');
const { sequelize } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/budget?trip_id=X
router.get('/', authMiddleware, async (req, res) => {
  const { trip_id } = req.query;
  if (!trip_id) return res.status(400).json({ message: 'trip_id required' });
  try {
    const [entries] = await sequelize.query(
      'SELECT * FROM budget_entries WHERE trip_id = ? ORDER BY entry_date',
      { replacements: [trip_id] }
    );
    const [summary] = await sequelize.query(
      `SELECT category, SUM(amount) AS total FROM budget_entries WHERE trip_id = ? GROUP BY category`,
      { replacements: [trip_id] }
    );
    const [actCosts] = await sequelize.query(
      `SELECT SUM(a.cost) AS activities_total FROM activities a
       JOIN stops s ON a.stop_id = s.id WHERE s.trip_id = ?`,
      { replacements: [trip_id] }
    );
    res.json({ entries, summary, activities_total: actCosts[0]?.activities_total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/budget
router.post('/', authMiddleware, async (req, res) => {
  const { trip_id, category, amount, notes, entry_date } = req.body;
  if (!trip_id || !amount) return res.status(400).json({ message: 'trip_id and amount required' });
  try {
    const [result] = await sequelize.query(
      'INSERT INTO budget_entries (trip_id, category, amount, notes, entry_date) VALUES (?, ?, ?, ?, ?)',
      { replacements: [trip_id, category || 'misc', amount, notes || '', entry_date || null] }
    );
    const [entry] = await sequelize.query('SELECT * FROM budget_entries WHERE id = ?', { replacements: [result] });
    res.status(201).json(entry[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/budget/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM budget_entries WHERE id = ?', { replacements: [req.params.id] });
    res.json({ message: 'Budget entry deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
