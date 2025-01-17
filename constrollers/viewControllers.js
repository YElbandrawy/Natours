const Tour = require('../models/toursModel');
const User = require('../models/usersModel');
const Booking = require('../models/bookingsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { render } = require('pug');

exports.getOverview = catchAsync(async (req, res, next) => {
  //load Tours Data
  const tours = await Tour.find();
  //pass tours data to the template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getLogInForm = (req, res) => {
  res.status(200).render('login');
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup');
};
exports.getResetpasswordForm = (req, res) => {
  res.status(200).render('resetPassword');
};
// /tour/:slug
exports.getTour = catchAsync(async (req, res, next) => {
  //get the tour data (include guides and reviews)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review user rating',
  });
  if (!tour) {
    return next(new AppError('This Tour not found', 404));
  }
  //render the template
  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});

exports.getMyAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My account',
  });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  //get the user's bookings
  const bookings = await Booking.find({ user: req.user.id });
  //find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render('overview', {
    title: 'My bookings',
    tours,
  });
});
