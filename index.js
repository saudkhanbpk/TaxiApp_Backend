const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
console.log("route:", app.path)
// Routes
app.use('/api/auth', authRoutes);

// Database Connection
db();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
