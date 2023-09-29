const mongoose = require('mongoose');

async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database connected: ${conn.connection.host}`);
}

module.exports = connectDB;
