const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const freelancerRoutes = require('./apis/freelancerApi');
const clientRoutes = require('./apis/clientApi');
const adminRoutes = require('./apis/adminApi');
const app = express();

dotenv.config();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());

// Routes
app.use('/freelancer-api', freelancerRoutes);
app.use('/client-api', clientRoutes);
app.use('/admin-api', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server start
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

