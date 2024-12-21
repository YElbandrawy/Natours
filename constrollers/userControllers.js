const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/usersModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');
const filterReqBody = require('./../utils/filterReqBody');
///////////////////////////////////////////
/*******MULTER Configuration****/
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  //check if the uploaded file is Image
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not An Image, please upload only images!.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
/*******************************/
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
exports.enablePhotoUpload = upload.single('photo');

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
    // Password: user can only change the password through authControllers.updatePassword()
    req,
    'name',
    'email'
  );
  if (req.file) filteredData.photo = req.file.filename;

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
