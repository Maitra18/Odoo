require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/trips',      require('./routes/trips'));
app.use('/api/stops',      require('./routes/stops'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/budget',     require('./routes/budget'));
app.use('/api/packing',    require('./routes/packing'));
app.use('/api/notes',      require('./routes/notes'));
app.use('/api/cities',     require('./routes/cities'));
app.use('/api/admin',      require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── Catch-all → serve index.html ────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Traveloop server running on http://localhost:${PORT}`);
    console.log(`📁 Frontend: http://localhost:${PORT}/`);
    console.log(`🔌 API:      http://localhost:${PORT}/api/health`);
  });
});
