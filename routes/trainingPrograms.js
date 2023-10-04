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

const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
const TrainingProgram = require('../models/TrainingProgram');
const advancedResults = require('../middleware/advancedResults');
const {
  protect,
  authorize,
  checkOwnership,
} = require('../middleware/authentication');

router = express.Router();

router.use('/:programId/courses', courseRouter);
router.use('/:programId/reviews', reviewRouter);

router.route('/radius/:postcode/:distance').get(getTrainingProgramsInRadius);

router
  .route('/:id/photo')
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkOwnership(TrainingProgram),
    uploadTrainingProgramPhoto
  );

router
  .route('/')
  .get(advancedResults(TrainingProgram, 'courses'), getTrainingPrograms)
  .post(protect, authorize('publisher', 'admin'), createTrainingProgram);

router
  .route('/:id')
  .get(getTrainingProgram)
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkOwnership(TrainingProgram),
    updateTrainingProgram
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    checkOwnership(TrainingProgram),
    deleteTrainingProgram
  );

module.exports = router;
