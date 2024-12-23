const express = require('express');
const router = express.Router();

const tourController = require('./../constrollers/tourControllers');
const authController = require('./../constrollers/authControllers');
const reviewRouter = require('./../routes/reviewsRoutes');

//////////////////////////////////////////////////////
router.use('/:tourId/reviews', reviewRouter);
//////////////////////////////////////////////////////

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/toursStats')
  .get(authController.protect, tourController.getToursStats);

router
  .route('/monthlyPlan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'guide', 'lead-guide'),
    tourController.getMonthlyPlan
  );
//tours-within/:distance/center/:latlng/unit/:unit
//tours-within/200/center/37.034817,-121.771000/unit/mil
////unit/:unit
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.checkBody,
    tourController.creatTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.enableTourPhotoUpload,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
