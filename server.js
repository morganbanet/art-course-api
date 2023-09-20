const express = require('express');

// Dotenv config
require('dotenv').config({ path: './config/config.env' });

// Express config
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/v1/training-programs', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
