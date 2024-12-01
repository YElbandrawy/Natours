const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewController = require('./../constrollers/reviewControllers');
const authController = require('./../constrollers/authControllers');

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setUserTourId,
    reviewController.postReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user'),
    authController.restrictToAuthor,
    reviewController.updateReview
  ) //any user can update and delete any review
  .delete(
    authController.restrictTo('admin', 'user'),
    authController.restrictToAuthor,
    reviewController.deleteReview
  );

module.exports = router;
