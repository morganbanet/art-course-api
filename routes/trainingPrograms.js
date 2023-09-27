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

router.use('/:programId/courses', courseRouter);

router.route('/radius/:postcode/:distance').get(getTrainingProgramsInRadius);

router.route('/:id/photo').put(uploadTrainingProgramPhoto);

router
  .route('/')
  .get(advancedResults(TrainingProgram, 'courses'), getTrainingPrograms)
  .post(createTrainingProgram);

router
  .route('/:id')
  .get(getTrainingProgram)
  .put(updateTrainingProgram)
  .delete(deleteTrainingProgram);

module.exports = router;
