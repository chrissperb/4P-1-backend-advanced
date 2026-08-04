const express = require('express');
const userRoutes = require('./routes/userRoutes');
const { AppError } = require('./errors/customErrors');

const app = express();

// Body parser middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'User Management REST API is running'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

module.exports = app;
