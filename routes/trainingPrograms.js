const express = require('express');
const router = express('router');

const {
  getTrainingPrograms,
  getTrainingProgram,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
} = require('../controllers/trainingPrograms');

router.route('/').get(getTrainingPrograms).post(createTrainingProgram);

router
  .route('/:id')
  .get(getTrainingProgram)
  .put(updateTrainingProgram)
  .delete(deleteTrainingProgram);

module.exports = router;
