const mongoose = require('mongoose');

const userStockSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  //   stockAmount: {
  //     type: Number,
  //   },
  quantity: {
    type: Number,
  },
});

// const UserStocks = mongoose.model('UserStocks', userStockSchema);

module.exports = userStockSchema;
