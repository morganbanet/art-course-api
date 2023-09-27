const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const advancedResults = require('../middleware/advancedResults');

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
