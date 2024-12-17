const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  const newError = new AppError(message, 400);
  return newError;
};
const handleDuplicateKeyDB = (err) => {
  const fieldValue = err.errorResponse.errmsg.match(
    /(["'])(?:(?=(\\?))\2.)*?\1/
  )[0];
  const message = `Duplicated field value ${fieldValue}. Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(' ');
  return new AppError(`invalid input data. ${message}`, 400);
};
const handleJsonWebTokenError = () => {
  return new AppError('access denied, please Login!', 401);
};
const handleTokenExpiredError = () => {
  return new AppError('Your token has expired, please Login again!', 401);
};
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API end-Points
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // rendered website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API end-Points
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('Error💥:', err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: 'someting went wrong!',
    });
  }
  // Renderd website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'someting went wrong',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'someting went wrong',
    msg: 'someting went wrong!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (err.name === 'CastError') {
      //we tried to do it with "error.name" and it failed, no field 'name' in error
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateKeyDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleTokenExpiredError();
    }
    sendErrorProd(err, req, res);
  }
};
