const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });
const TrainingProgram = require('./models/TrainingProgram');

mongoose.connect(process.env.MONGO_URI);
console.log('Database connected');

const trainingPrograms = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/training-programs.json`, 'utf-8')
);

const importData = async () => {
  try {
    console.log('Seeding database...'.bgYellow);
    await TrainingProgram.create(trainingPrograms);
    console.log('Database seeded successfully'.bgGreen);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const flushData = async () => {
  try {
    console.log('Flushing database...'.bgYellow);
    await TrainingProgram.deleteMany();
    console.log('Database flushed successfully'.bgRed);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === '-f') {
  flushData();
} else {
  importData();
}
