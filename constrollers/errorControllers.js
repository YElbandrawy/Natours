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
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error💥:', err);

    res.status(err.statusCode).json({
      status: err.status,
      message: 'someting went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
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

    // console.log('err :', err);
    // console.log('error :', error);
    sendErrorProd(error, res);
  }
};
