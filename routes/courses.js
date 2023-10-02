const express = require('express');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');
const {
  protect,
  authorize,
  checkOwnership,
} = require('../middleware/authentication');

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
  .post(protect, authorize('publisher', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkOwnership(Course),
    updateCourse
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    checkOwnership(Course),
    deleteCourse
  );

module.exports = router;
