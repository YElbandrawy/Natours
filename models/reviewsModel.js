const mongoose = require('mongoose');
const Tour = require('./toursModel');
//review , rating , createdAt, ref to User, ref to Tour
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'please tell us your valuable review 🤓'],
      minlength: [8],
      maxlength: [300],
    },
    rating: {
      type: Number,
      required: true,
      min: [0, 'rating can not be below 0 😟'],
      max: [
        5,
        'we appreciate your generosity,unfortunately ratings can not be above 5 😍',
      ],
    },
    createdAT: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//a user can write only one review on a single tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.updateRatingsInfo = async function (tourId) {
  //"this" keyword refer to the model "Review"
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  //save updates to the dataBase
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: Math.round(stats[0].avgRatings * 10) / 10,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//update ratingsQuantity and ratingsAverage evey time a new review posted
reviewSchema.post('save', async function () {
  //"this" keyword refer to the current document
  await this.constructor.updateRatingsInfo(this.tour);
});

//update ratingsQuantity and ratingsAverage evey time a review edited
reviewSchema.post(/^findOneAnd/, async function (result) {
  await this.model.updateRatingsInfo(result.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
