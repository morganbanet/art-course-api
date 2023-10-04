const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });
const TrainingProgram = require('./models/TrainingProgram');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

mongoose.connect(process.env.MONGO_URI);
console.log('Database connected');

const trainingPrograms = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/training-programs.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    console.log('Seeding database...'.bgYellow);

    await TrainingProgram.create(trainingPrograms);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);

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
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

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
