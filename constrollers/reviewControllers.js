const Review = require('./../models/reviewsModel');
//const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');

//middleWare to prepare the request body
exports.setUserTourId = (req, res, next) => {
  req.body.user = req.user;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};
//get reviews
exports.getAllReviews = factory.getAll(Review);
//get A review
exports.getReview = factory.getOne(Review);
//post reveiw
exports.postReview = factory.creatOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
