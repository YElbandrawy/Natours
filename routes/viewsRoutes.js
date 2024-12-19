const express = require('express');
const router = express.Router();

const viewControllers = require('../constrollers/viewControllers');
const authControllers = require('../constrollers/authControllers');

router.get('/', authControllers.isLogedIn, viewControllers.getOverview);

router.get('/tour/:slug', authControllers.isLogedIn, viewControllers.getTour);

router.get('/login', authControllers.isLogedIn, viewControllers.getLogInForm);

router.get('/signup', authControllers.isLogedIn, viewControllers.getSignupForm);

router.get('/me', authControllers.protect, viewControllers.getMyAccount);
module.exports = router;
