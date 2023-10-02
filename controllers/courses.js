const Course = require('../models/Course');
const TrainingProgram = require('../models/TrainingProgram');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc        Get all courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/training-programs/:programId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.programId) {
    const courses = await Course.find({
      trainingProgram: req.params.programId,
    });

    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'trainingProgram',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc        Create course
// @route       POST /api/v1/training-programs/:programId/courses
// @access      Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.trainingProgram = req.params.programId;
  req.body.user = req.user.id;

  const trainingProgram = await TrainingProgram.findById(req.params.programId);

  if (!trainingProgram) {
    return next(
      new ErrorResponse(
        `Training program not found with id ${req.params.programId}`
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ successful: true, data: course });
});

// @desc        Update course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ successful: true, data: course });
});

// @desc        Delete course
// @route       DELETE /api/v1/course/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  await course.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
