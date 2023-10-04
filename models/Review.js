const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      maxlength: [50, 'Title cannot be more than 50 characters'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Please add some text to the body'],
      maxlength: [500, 'Review cannot be more than 500 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Please enter a number between 1 and 10'],
    },
    trainingProgram: {
      type: mongoose.Schema.ObjectId,
      ref: 'Training Program',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per training program
ReviewSchema.index({ trainingProgram: 1, user: 1 }, { unique: true });

// Get average rating of training programs
ReviewSchema.statics.getAverageRating = async function (programId) {
  const obj = await this.aggregate([
    {
      $match: { trainingProgram: programId },
    },
    {
      $group: {
        _id: '$trainingProgram',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await this.model('Training Program').findByIdAndUpdate(
    programId,
    {
      averageRating: obj[0].averageRating,
    },
    { new: true, runValidators: true }
  );
};

// Calculate the average training program rating
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.trainingProgram);
});

ReviewSchema.post('remove', function () {
  this.constructor.getAverageRating(this.trainingProgram);
});

module.exports = mongoose.model('Review', ReviewSchema);
