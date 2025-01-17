const express = require('express');
const router = express.Router();

const bookingControllers = require('../constrollers/bookingControllers');
const authControllers = require('../constrollers/authControllers');

router.use(authControllers.protect);
router.post('/checkout-session/:tourId', bookingControllers.getCheckoutSession);

router.use(authControllers.restrictTo('admin', 'lead-guide'));
router
  .route('/')
  .get(bookingControllers.getAllBookings)
  .post(bookingControllers.createBooking);

router
  .route('/:id')
  .get(bookingControllers.getBooking)
  .patch(bookingControllers.updateBooking)
  .delete(bookingControllers.deleteBooking);

module.exports = router;
