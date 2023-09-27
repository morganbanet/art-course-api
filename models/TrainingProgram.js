const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');
const slugify = require('slugify');

const TrainingProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      maxlength: [50, 'Title cannot be more than 50 characters'],
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
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

// Create slug from training program name
TrainingProgramSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Create location field
TrainingProgramSchema.pre('save', async function (next) {
  const geoLocate = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [geoLocate[0].longitude, geoLocate[0].latitude],
    formattedAddress: geoLocate[0].formattedAddress,
    street: geoLocate[0].streetName,
    city: geoLocate[0].city,
    state: geoLocate[0].stateCode,
    postcode: geoLocate[0].zipcode,
    country: geoLocate[0].countryCode,
  };

  // Prevent storing client submitted address
  this.address = undefined;

  next();
});

// Cascade delete courses when training program deleted
TrainingProgramSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    await this.model('Course').deleteMany({ trainingProgram: this._id });
    next();
  }
);

// Reverse populate
TrainingProgramSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'trainingProgram',
  justOne: false,
});

module.exports = mongoose.model('Training Program', TrainingProgramSchema);
