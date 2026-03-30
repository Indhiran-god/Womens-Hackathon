require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maternal_health';

// Attempt DB connection with short timeout so server starts quickly
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,  // fail fast if mongo not running
  connectTimeoutMS: 5000,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.warn('⚠️  MongoDB not found — running in OFFLINE mode.');
    console.warn('   Start MongoDB to enable full database features.');
  });

// API Routes
app.use('/api', apiRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler — prevent unhandled crashes
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error', detail: err.message });
});

app.listen(PORT, () => {
    console.log(`\n🚀 MHC Backend running at http://localhost:${PORT}`);
    console.log(`📋 API Base: http://localhost:${PORT}/api`);
    console.log(`🛡️  Admin:   http://localhost:5173/admin\n`);
});
