const express = require('express');

const { getCourses } = require('../controllers/courses');

// Advanced Results
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

router = express.Router({ mergeParams: true });

router.route('/').get(
  advancedResults(Course, {
    path: 'trainingProgram',
    select: 'title description',
  }),
  getCourses
);

module.exports = router;
