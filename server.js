const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Security packages
const mongoSanitize = require('express-mongo-sanitize');
const sanitizer = require('express-html-sanitizer');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

// Dotenv config
require('dotenv').config({ path: './config/config.env' });

// Route imports
const trainingPrograms = require('./routes/trainingPrograms');
const courses = require('./routes/courses');
const authentication = require('./routes/authentication');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Express config
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // Cookie parser
app.use(fileupload()); // File uploading

// Morgan config
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Security config
app.use(mongoSanitize()); // Prevent NoSQL injects
app.use(sanitizer()); // Prevent XSS attacks
app.use(helmet()); // Security headers
app.use(hpp()); // Prevent HTML parameter pollution
app.use(cors()); // Allow cross origin resource sharing

// Rate limit, 10 mins, 100 requests per window
app.use(rateLimit({ windowMs: 10 * 60 * 1000, limit: 100 }));

// File uploading

// Route mounting
app.use('/api/v1/training-programs', trainingPrograms);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', authentication);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Error middleware
app.use(errorHandler);

// Run server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(process.exit(1));
});
