const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      maxlength: [50, 'Title cannot be more than 50 characters'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    weeks: {
      type: Number,
      required: [true, 'Please add an amount of weeks'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add a tuition fee'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum skill'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
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

// Get average cost of tuitions
CourseSchema.statics.getAverageCost = async function (programId) {
  const obj = await this.aggregate([
    {
      $match: { trainingProgram: programId },
    },
    {
      $group: {
        _id: '$trainingProgram',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  await this.model(`Training Program`).findByIdAndUpdate(
    programId,
    {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    },
    { new: true, runValidators: true }
  );
};

// Calculate the average course cost
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.trainingProgram);
});

CourseSchema.post('remove', function () {
  this.constructor.getAverageCost(this.trainingProgram);
});

module.exports = mongoose.model('Course', CourseSchema);
