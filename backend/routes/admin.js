const express = require('express');
const { sequelize } = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [[{ total_users }]] = await sequelize.query('SELECT COUNT(*) AS total_users FROM users WHERE role = "user"');
    const [[{ total_trips }]] = await sequelize.query('SELECT COUNT(*) AS total_trips FROM trips');
    const [[{ public_trips }]] = await sequelize.query('SELECT COUNT(*) AS public_trips FROM trips WHERE is_public = 1');
    const [[{ total_activities }]] = await sequelize.query('SELECT COUNT(*) AS total_activities FROM activities');

    const [top_cities] = await sequelize.query(
      `SELECT city, COUNT(*) AS count FROM stops GROUP BY city ORDER BY count DESC LIMIT 10`
    );
    const [recent_users] = await sequelize.query(
      `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 20`
    );
    const [trips_per_day] = await sequelize.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count FROM trips
       GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`
    );
    const [activity_types] = await sequelize.query(
      `SELECT type, COUNT(*) AS count FROM activities GROUP BY type ORDER BY count DESC`
    );

    res.json({ total_users, total_trips, public_trips, total_activities, top_cities, recent_users, trips_per_day, activity_types });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM users WHERE id = ? AND role != "admin"', { replacements: [req.params.id] });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
