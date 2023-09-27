const TrainingProgram = require('../models/TrainingProgram');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder');

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
// @route       POST /api/v1/training-programs
// @access      Private
exports.createTrainingProgram = asyncHandler(async (req, res, next) => {
  const trainingProgram = await TrainingProgram.create(req.body);

  res.status(201).json({ success: true, data: trainingProgram });
});

// @desc        Update a training program
// @route       PUT /api/v1/training-programs/:id
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
// @route       DELETE /api/v1/training-programs/:id
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

// @desc        Get training training programs in radius
// @route       GET /api/v1/training-programs/radius/:postcode/:distance
// @access      Public
exports.getTrainingProgramsInRadius = asyncHandler(async (req, res, next) => {
  const { postcode, distance } = req.params;

  const loc = await geocoder.geocode(postcode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  // Divide distance by radius of Earth in miles
  const radius = distance / 3963;

  const trainingPrograms = await TrainingProgram.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });

  console.log(trainingPrograms);

  res.status(200).json({
    success: true,
    count: trainingPrograms.length,
    data: trainingPrograms,
  });
});
