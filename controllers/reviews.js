const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Review = require('../models/Review');
const TrainingProgram = require('../models/TrainingProgram');

// @desc        Get reviews for a training program
// @route       GET /api/v1/reviews
// @route       GET /api/v1/training-programs/:programId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.programId) {
    const reviews = await Review.find({
      trainingProgram: req.params.programId,
    });

    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get reviews for a training program
// @route       GET /api/v1/reviews/:id
// @access      Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'trainingProgram',
    select: 'title description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc        Create review
// @route       POST /api/v1/training-programs/:programId/reviews
// @access      Private
exports.createReview = asyncHandler(async (req, res, next) => {
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

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// @desc        Update reviews
// @route       GET /api/v1/reviews/:id
// @access      Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}`, 404)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc        Delete review
// @route       GET /api/v1/reviews/:id
// @access      Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id ${req.params.id}`, 404)
    );
  }

  await review.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
