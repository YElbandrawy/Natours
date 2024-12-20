const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const filterReqBody = require('./../utils/filterReqBody');

exports.getAll = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    //to make it work with get all reviews
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //with filters
    //build the query
    let features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //execute query
    const doc = await features.query; //.explain();
    res.status(200).json({
      status: 'success',
      length: doc.length,
      data: doc,
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('no document found with this ID', 404));
    }
    res.json({
      status: 'success',
      data: doc,
    });
  });

exports.creatOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //sanitize the user input data
    const filteredData = filterReqBody(
      req,
      'name',
      'email',
      'photo',
      'price',
      'difficulty',
      'slug',
      'duration',
      'maxGroupSize',
      'summary',
      'description',
      'imageCover',
      'images',
      'startDates',
      'startLocation',
      'locations',
      'guides'
    );

    const updateData = { $set: filteredData };
    const doc = await Model.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('no Document found with this ID', 404));
    }

    res.json({
      status: 'success',
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('no Document found with this ID', 404));
    }
    res.json({
      status: 'success',
    });
  });
