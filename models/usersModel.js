const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('os');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
    minlength: [8, 'user name must be more than 8 charachters!'],
    maxlength: [21, 'user name must be below 21 charachters!'],
  },
  email: {
    type: String,
    required: [true, 'your E-mail is required,please provide a valid email.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'user must have a password please provide a valid one'],
    minlength: [8, 'password must be more than 8 charachters'],
    maxlength: [20, 'password must be bellow 20 charachters'],
    select: false,
  },
  passwordconfirm: {
    type: String,
    required: [true, 'user must confirm the password'],
    validate: {
      validator: function (v) {
        return v === this.password;
      },
      message: 'passwors are not the same',
    },
  },
  passwordCreatedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'guide', 'lead-guide'],
    },
    default: 'user',
  },
  passwordResetToken: {
    type: String,
  },
  resetTokenExpire: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //note: catchAsync didn't work
  //to make the function works only if the password modified
  if (!this.isModified('password')) return next();

  //save the password hashed in the DB
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordconfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordCreatedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {
  //this points to the query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.passwordChangedAfter = async function (JWTtimeStamp) {
  if (this.passwordCreatedAt) {
    const lastEdit = this.passwordCreatedAt.getTime() / 1000;
    return lastEdit > JWTtimeStamp;
  }
  //false means it hasn't been modified after the token has been issued
  return false;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.creatPasswordRestToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  //you need to save the token hashed in the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
