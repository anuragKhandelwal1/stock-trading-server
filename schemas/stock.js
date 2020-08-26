const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  symbol: {
    type: String,
  },
  logo: {
    type: String,
  },
  yearIPOed: {
    type: Date,
  },
  currentPrice: {
    type: Number,
    min: 0,
    required: true,
  },
  highestPrice: {
    type: Number,
    min: 0,
  },
  lowestPrice: {
    type: Number,
    min: 0,
  },
  availability: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
