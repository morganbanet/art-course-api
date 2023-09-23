const TrainingProgram = require('../models/TrainingProgram');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc        Get all training programs
// @route       GET /api/v1/training-programs
// @access      Public
exports.getTrainingPrograms = asyncHandler(async (req, res, next) => {
  const trainingPrograms = await TrainingProgram.find();

  if (!trainingPrograms) {
    return new ErrorResponse(`Training programs not found`, 400);
  }

  res.status(200).json({
    success: true,
    count: trainingPrograms.length,
    data: trainingPrograms,
  });
});

// @desc        Get single training program
// @route       GET /api/v1/training-programs/:id
// @access      Public
exports.getTrainingProgram = asyncHandler(async (req, res, next) => {
  const trainingProgram = await TrainingProgram.findById(req.params.id);

  if (!trainingProgram) {
    return new ErrorResponse(
      `Training program with id of ${req.params.id} not found`,
      400
    );
  }

  res.status(200).json({ success: true, data: trainingProgram });
});

// @desc        Create new training program
// @route       POST /api/v1/training-program
// @access      Private
exports.createTrainingProgram = asyncHandler(async (req, res, next) => {
  const trainingProgram = await TrainingProgram.create(req.body);

  res.status(201).json({ success: true, data: trainingProgram });
});

// @desc        Update a training program
// @route       PUT /api/v1/training-program/:id
// @access      Private
exports.updateTrainingProgram = asyncHandler(async (req, res, next) => {
  const trainingProgram = await TrainingProgram.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!trainingProgram) {
    return new ErrorResponse(
      `Training program with id of ${req.params.id} not found`,
      400
    );
  }

  res.status(200).json({ success: true, data: trainingProgram });
});

// @desc        Delete a training program
// @route       DELETE /api/v1/training-program/:id
// @access      Private
exports.deleteTrainingProgram = asyncHandler(async (req, res, next) => {
  const trainingProgram = await TrainingProgram.findByIdAndDelete(
    req.params.id
  );

  if (!trainingProgram) {
    return new ErrorResponse(
      `Training program with id of ${req.params.id} not found`,
      400
    );
  }

  res.status(200).json({ success: true, data: {} });
});
