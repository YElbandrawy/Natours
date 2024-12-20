const User = require('./../models/usersModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');
const filterReqBody = require('./../utils/filterReqBody').default;
///////////////////////////////////////////
exports.getAllUsers = factory.getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //req.user{...obj}
  if (req.body.password || req.body.passwordconfirm) {
    return next(
      new AppError(
        'password updating isnt allowed, Please use /users/updatepassword',
        400
      )
    );
  }
  const filteredData = filterReqBody(
    // user can only change the password through authControllers.updatePassword()
    req,
    'name',
    'email',
    'photo'
  );
  const updateData = { $set: filteredData };
  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    Newuser: user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'deleted successfuly',
    data: null,
  });
});

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
