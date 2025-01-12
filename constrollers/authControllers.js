const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./../models/usersModel');
const Review = require('./../models/reviewsModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const EmailService = require('./../utils/email');
const filterReqBody = require('./../utils/filterReqBody');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

const createSendToken = catchAsync(async (userID, statusCode, res) => {
  const token = signToken(userID);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  //filter the request body
  //user cant't define the role only the admin can through "updatUser"
  const userInfo = filterReqBody(
    req,
    'name',
    'email',
    'photo',
    'password',
    'passwordconfirm'
  );
  const newUser = await User.create(userInfo);

  await createSendToken(newUser._id, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if the emai and the password were sent correctly
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  // check if the user exist && chek credentials
  const user = await User.findOne({ email: { $eq: email } }).select(
    '+password'
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //send the token
  await createSendToken(user._id, 201, res);
});

exports.logout = async (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  res.cookie('jwt', 'logedout', cookieOptions);

  res.status(200).json({
    status: 'success',
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get the user based on the psted email
  const user = await User.findOne({ email: { $eq: req.body.email } });
  if (!user) {
    return next(new AppError('Wrong email 😄', 404));
  }
  // generate the reset token
  const resetToken = await user.creatPasswordRestToken();
  await user.save({ validateBeforeSave: false });

  //send the reset token to the user
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `click the following link to reset your password,\n reset password:${resetURL},\n 
  if you didn't forget your password please ignore this E-mail.`;
  try {
    await EmailService.sendPasswordResetUrl(user, resetURL);

    res.status(201).json({
      status: 'success',
      message: 'email sent successfuly',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    console.dir(error);
    return next(
      new AppError(
        'there was an error sending the email, please try again later!!'
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get the user based on the token && vertify the token expirtation
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('the User notFound OR the token Expired!🫢', 400));
  }

  //modify the password in the DB
  user.password = req.body.password;
  user.passwordconfirm = req.body.passwordconfirm;

  //modify the passwordResetToken && resetTokenExpire fields to undefiend in the DB
  user.passwordResetToken = undefined;
  user.resetTokenExpire = undefined;

  //save the document
  await user.save();
  //log the user in (send the login token)
  await createSendToken(user._id, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //check if the token exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('you are not loged in, please login to gain access!!', 401)
    );
  }
  //check if the token valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check if the user is still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'this User has been deleted, please login to gain access!!',
        401
      )
    );
  }
  //check if the user changed the password
  if (await currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('the password has changed, please login again!!'),
      401
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is a list ==> roles = ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      next(
        new AppError(
          'You do not have permission to perform this action!🖕',
          403
        )
      );
    }
    next();
  };
};

exports.restrictToAuthor = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  const review = await Review.findById(req.params.id);
  const reviewAuthor = review.user._id.toString();
  // console.log(review.user._id.toString());
  // console.log(req.user.id);
  if (!(reviewAuthor === req.user.id)) {
    return next(
      new AppError('only the Author can edit or delete his review😄', 403)
    );
  }
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //validate and decode the token(done by protect())
  //find the user (got the user id by protect())
  const user = await User.findById(req.user.id).select('+password');
  //check the current password
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(
      new AppError('the current password is not correct, try again!😄', 400)
    );
  }
  //update the password
  user.password = req.body.newPassword;
  user.passwordconfirm = req.body.passwordconfirm;
  await user.save();
  //login the user again
  await createSendToken(user._id, 201, res);
});

/***********UI Auth. Section**********/

exports.isLogedIn = async (req, res, next) => {
  try {
    //check if the user is loged in
    if (req.cookies.jwt) {
      //check if the token valid
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //check if the user is still exist
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //check if the user changed the password
      if (await currentUser.passwordChangedAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = currentUser;
    }
    next();
  } catch (err) {
    next();
  }
};
