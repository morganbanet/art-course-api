const express = require('express');

const {
  getTrainingPrograms,
  getTrainingProgram,
  getTrainingProgramsInRadius,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
} = require('../controllers/trainingPrograms');

// Advanced results
const TrainingProgram = require('../models/TrainingProgram');
const advancedResults = require('../middleware/advancedResults');

const router = express('router');

router.route('/radius/:postcode/:distance').get(getTrainingProgramsInRadius);

router
  .route('/')
  .get(advancedResults(TrainingProgram), getTrainingPrograms)
  .post(createTrainingProgram);

router
  .route('/:id')
  .get(getTrainingProgram)
  .put(updateTrainingProgram)
  .delete(deleteTrainingProgram);

module.exports = router;
