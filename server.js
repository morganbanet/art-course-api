const express = require('express');
const morgan = require('morgan');

// Dotenv config
require('dotenv').config({ path: './config/config.env' });

// Route imports
const trainingPrograms = require('./routes/trainingPrograms');

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
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
