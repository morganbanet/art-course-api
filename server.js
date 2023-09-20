const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Dotenv config
require('dotenv').config({ path: './config/config.env' });

// Route imports
const trainingPrograms = require('./routes/trainingPrograms');

// Connect to database
connectDB();

// Express config
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Morgan config
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Route mounting
app.use('/api/v1/training-programs', trainingPrograms);

// Run server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(process.exit(1));
});
