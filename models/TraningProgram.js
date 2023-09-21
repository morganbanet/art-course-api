const mongoose = require('mongoose');

// @Todo: Create models and schemas
const TrainingProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
    unique: true,
    trim: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    maxlength: [14, 'Phone number cannot be longer than 14 characters'],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    type: {
      type: String,
      enum: ['point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    county: String,
    postcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Digital Artist',
      '3D Character Modeller',
      'Concept Artist',
      'Character Design Artist',
      'Environment Design Artist',
      'Novel Artist',
      'IP Developer',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'The minimum rating must be 1'],
    max: [5, 'The maximum rating is 5'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Training Program', TrainingProgramSchema);
