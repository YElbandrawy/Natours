const Tour = require('./../models/toursModel');
const User = require('./../models/usersModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

// /tour/:slug
exports.getTour = catchAsync(async (req, res, next) => {
  //get the tour data (include guides and reviews)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review user rating',
  });
  if (!tour) {
    console.log('hello No tour');
    return next(new AppError('This Tour not found', 404));
  }
  //render the template
  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});
