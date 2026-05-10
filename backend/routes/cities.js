const express = require('express');
const { sequelize } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/cities?search=X&country=Y&region=Z
router.get('/', authMiddleware, async (req, res) => {
  const { search = '', country = '', region = '' } = req.query;
  try {
    let query = 'SELECT * FROM cities WHERE 1=1';
    const replacements = [];
    if (search) { query += ' AND (name LIKE ? OR country LIKE ?)'; replacements.push(`%${search}%`, `%${search}%`); }
    if (country) { query += ' AND country = ?'; replacements.push(country); }
    if (region) { query += ' AND region = ?'; replacements.push(region); }
    query += ' ORDER BY popularity DESC LIMIT 50';
    const [rows] = await sequelize.query(query, { replacements });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/cities/popular — top 6 cities
router.get('/popular', async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      'SELECT * FROM cities ORDER BY popularity DESC LIMIT 6'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/cities/:id/activities
router.get('/:id/activities', authMiddleware, async (req, res) => {
  const { type, maxCost } = req.query;
  try {
    let query = 'SELECT * FROM city_activities WHERE city_id = ?';
    const replacements = [req.params.id];
    if (type) { query += ' AND type = ?'; replacements.push(type); }
    if (maxCost) { query += ' AND cost <= ?'; replacements.push(maxCost); }
    query += ' ORDER BY name';
    const [rows] = await sequelize.query(query, { replacements });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
