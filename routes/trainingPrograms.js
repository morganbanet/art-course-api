const express = require('express');

const {
  getTrainingPrograms,
  getTrainingProgram,
  getTrainingProgramsInRadius,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
} = require('../controllers/trainingPrograms');

const router = express('router');

router.route('/radius/:postcode/:distance').get(getTrainingProgramsInRadius);

router.route('/').get(getTrainingPrograms).post(createTrainingProgram);

router
  .route('/:id')
  .get(getTrainingProgram)
  .put(updateTrainingProgram)
  .delete(deleteTrainingProgram);

module.exports = router;
