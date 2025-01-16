const express = require('express');
const router = express.Router();

const bookingControllers = require('../constrollers/bookingControllers');
const authControllers = require('../constrollers/authControllers');

router.post(
  '/checkout-session/:tourId',
  authControllers.protect,
  bookingControllers.getCheckoutSession
);

module.exports = router;
