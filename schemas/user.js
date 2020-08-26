const mongoose = require('mongoose');
const userStocksSchema = require('./user-stocks');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    index: true,
    trim: true,
    minlength: 5,
    required: [true, 'Username is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  isLoggedIn: {
    type: Boolean,
  },
  currentBalance: {
    type: Number,
  },
  stocks: [userStocksSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
