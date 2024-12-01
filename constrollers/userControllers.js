const User = require('./../models/usersModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');

////////////////////////////////////////////
/****************my helpers***************/
const filterObject = (obj, ...execlude) => {
  let retObject = JSON.parse(JSON.stringify(obj)); //deep clone the input object
  const objKeys = Object.keys(retObject);
  execlude.forEach((el) => {
    if (objKeys.includes(el)) {
      delete retObject[el];
    }
  });
  return retObject;
};

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

  const updateData = filterObject(
    req.body,
    'role',
    '_id',
    'id',
    'passwordCreatedAt',
    'passwordResetToken',
    'resetTokenExpire'
  );
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
