const express = require('express');
const router = express.Router();

const userController = require('./../constrollers/userControllers');
const authController = require('./../constrollers/authControllers');

////////////////////////////////////////////
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//protect all routes after this point
router.use(authController.protect);
/*************************************/
router.patch('/updatepassword', authController.updatePassword);
router.patch('/updateme', userController.updateMe);
router.delete('/deleteme', userController.deleteMe);
router.route('/me').get(userController.getMe, userController.getUser);
/*************************************/

//restrict all routes after this point (only admins can perform this actions)
router.use(authController.restrictTo('admin'));
/*************************************/
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
/*************************************/
module.exports = router;
