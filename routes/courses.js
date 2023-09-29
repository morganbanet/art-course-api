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

const { protect, authorize } = require('../middleware/authentication');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'trainingProgram',
      select: 'title description',
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
