const express = require('express');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

// Advanced Results
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'trainingProgram',
      select: 'title description',
    }),
    getCourses
  )
  .post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
