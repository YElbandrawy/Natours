////////////////////////////////////////////////////
const express = require('express');

//////////////import npm modules///////////////////
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
////////////import Our modules/////////////////////
const AppError = require('./utils/appError');
const globalErrorHandler = require('./constrollers/errorControllers');
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
///////////////////////////////////////////////////
const app = express();
/////////////////////////**Gloubal MiddleWares**////////////////////////////////
////remember middlewares are executed in the same order they are in the code////

//1)sets HTTP response headers(for security)
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//2)Limit requests for each IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too much requests rate, try again after 1 Hour😴',
});
app.use('/api', limiter);

//Read the data from the request body to req.body
app.use(express.json({ limit: '10kb' }));

//sanitize the user input data against NOSQL query injection
app.use(mongoSanitize());

//sanitize the user input data against XSS
app.use(xss());

//sanitize the user input data against Parameter Pollution
app.use(hpp({ whitelist: ['duration'] }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`the rout ${req.originalUrl} dosen't exist`, 404));
});
/////Global Error handling MiddleWare/////
app.use(globalErrorHandler);

///////////////////////////////////////////
module.exports = app;
