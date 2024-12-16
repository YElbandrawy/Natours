const express = require('express');
const router = express.Router();

const viewControllers = require('../constrollers/viewControllers');
const authControllers = require('../constrollers/authControllers');

router.use(authControllers.isLogedIn);
router.get('/', viewControllers.getOverview);

router.get('/tour/:slug', viewControllers.getTour);

router.get('/login', viewControllers.getLogInForm);

module.exports = router;
