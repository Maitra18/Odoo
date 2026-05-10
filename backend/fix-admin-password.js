/**
 * Fix Admin Password Script
 * Run this after importing schema.sql to ensure the admin password is correct.
 * Usage: node fix-admin-password.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, connectDB } = require('./config/db');

async function fix() {
  await connectDB();
  const hash = await bcrypt.hash('Admin@123', 10);
  await sequelize.query(
    `UPDATE users SET password_hash = ? WHERE email = 'admin@traveloop.com'`,
    { replacements: [hash] }
  );
  console.log('✅ Admin password updated to: Admin@123');
  console.log('📧 Email: admin@traveloop.com');
  process.exit(0);
}

fix().catch(e => { console.error('❌', e.message); process.exit(1); });
