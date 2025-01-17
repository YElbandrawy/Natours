////////////////////////////////////////////////////
const express = require('express');
const path = require('path');
//////////////import npm modules///////////////////
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
////////////import Our modules/////////////////////
const AppError = require('./utils/appError');
const globalErrorHandler = require('./constrollers/errorControllers');
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewsRoutes');
///////////////////////////////////////////////////
const app = express();
//set pug as our template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/////////////////////////**Gloubal MiddleWares**////////////////////////////////
////remember middlewares are executed in the same order they are in the code////

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//sets HTTP response headers(for security)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'default-src': [
        "'self'",
        'https://unpkg.com',
        'https://js.stripe.com/v3/',
      ],
      'script-src': ["'self'", 'https://unpkg.com', 'https://js.stripe.com'],
      'img-src': ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
      connectSrc: [
        "'self'",
        'http://127.0.0.1:8000',
        'https://api.stripe.com/',
        'ws://127.0.0.1:1234', // Add this line to allow WebSocket connections
        'https://*',
      ],
      frameSrc: ["'self'", 'https://js.stripe.com'],
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit requests for each IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'too much requests rate, try again after 1 Hour😴',
});
//app.use('/api', limiter);
app.use(limiter);

//Read the data from the request body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//sanitize the user input data against NOSQL query injection
app.use(mongoSanitize());

//sanitize the user input data against XSS
app.use(xss());

//sanitize the user input data against Parameter Pollution
app.use(hpp({ whitelist: ['duration'] }));

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`the rout ${req.originalUrl} dosen't exist`, 404));
});
/////Global Error handling MiddleWare/////
app.use(globalErrorHandler);

///////////////////////////////////////////
module.exports = app;
