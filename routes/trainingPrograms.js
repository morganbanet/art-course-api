const express = require('express');

const {
  getTrainingPrograms,
  getTrainingProgram,
  getTrainingProgramsInRadius,
  createTrainingProgram,
  updateTrainingProgram,
  uploadTrainingProgramPhoto,
  deleteTrainingProgram,
} = require('../controllers/trainingPrograms');

// Advanced results
const TrainingProgram = require('../models/TrainingProgram');
const advancedResults = require('../middleware/advancedResults');

const courseRouter = require('./courses');

router = express.Router();

const { protect, authorize } = require('../middleware/authentication');

router.use('/:programId/courses', courseRouter);

router.route('/radius/:postcode/:distance').get(getTrainingProgramsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), uploadTrainingProgramPhoto);

router
  .route('/')
  .get(advancedResults(TrainingProgram, 'courses'), getTrainingPrograms)
  .post(protect, authorize('publisher', 'admin'), createTrainingProgram);

router
  .route('/:id')
  .get(getTrainingProgram)
  .put(protect, authorize('publisher', 'admin'), updateTrainingProgram)
  .delete(protect, authorize('publisher', 'admin'), deleteTrainingProgram);

module.exports = router;
