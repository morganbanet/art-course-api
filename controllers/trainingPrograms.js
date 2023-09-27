const path = require('path');
const TrainingProgram = require('../models/TrainingProgram');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder');

// @desc        Get all training programs
// @route       GET /api/v1/training-programs
// @access      Public
exports.getTrainingPrograms = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  const trainingProgram = await TrainingProgram.findById(req.params.id);

  if (!trainingProgram) {
    return new ErrorResponse(
      `Training program with id of ${req.params.id} not found`,
      400
    );
  }

  await trainingProgram.deleteOne();

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

// @desc        Upload photo to training program
// @route       PUT /api/v1/training-programs/:id/photo
// @access      Private
exports.uploadTrainingProgramPhoto = asyncHandler(async (req, res, next) => {
  const trainingProgram = await TrainingProgram.findById(req.params.id);

  if (!trainingProgram) {
    return next(
      new ErrorResponse(
        `Training program not found with id ${req.params.id}`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('File must be an image', 400));
  }

  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `File must be below ${process.env.MAX_FILE_SIZE / 1000}Mb`,
        400
      )
    );
  }

  // Generate file name
  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse('Something went wrong when uploading', 500)
      );
    }

    // Associate program with uploaded photo
    await TrainingProgram.findByIdAndUpdate(
      req.params.id,
      {
        photo: file.name,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, data: trainingProgram });
  });
});
