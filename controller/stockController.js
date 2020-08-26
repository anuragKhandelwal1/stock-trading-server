const Stock = require('../schemas/stock');
const User = require('../schemas/user');

exports.get = async (req, res) => {
  try {
    const stocks = await Stock.where('availability').gt(0);
    res.status(200).send(stocks);
  } catch (err) {
    res.send(500).send(err);
  }
};

exports.add = async (req, res) => {
  try {
    const {
      companyName,
      symbol,
      logo,
      yearIPOed,
      highestPrice,
      lowestPrice,
      availability,
    } = req.body;

    await Stock.create({
      companyName,
      symbol,
      logo,
      yearIPOed,
      highestPrice,
      lowestPrice,
      availability,
    });
    res.status(200).json({ message: 'Stock Added' });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.buy = async (req, res) => {
  try {
    const { username, companyName, stockQuantity } = req.body;
    //todo : implement socket to emit stocks and users
    const { availability, currentPrice } = await Stock.findOne({ companyName });
    let { currentBalance, stocks } = await User.findOne({ username });

    if (stockQuantity > availability) {
      return res
        .status(400)
        .send({ message: `You can't but more than the available shares.` });
    }

    if (currentPrice * stockQuantity > currentBalance) {
      return res
        .status(400)
        .send({ message: `You don't have enough wallet balance.` });
    }

    const incrementCoefficient = stockQuantity / availability;
    await Stock.findOneAndUpdate(
      { companyName },
      {
        $set: {
          currentPrice: currentPrice * (1 + incrementCoefficient),
          availability: availability - stockQuantity,
        },
      }
    );

    const stockIndex = stocks.findIndex(
      (stock) => stock.companyName === companyName
    );
    if (stockIndex > -1) {
      stocks[stockIndex].quantity += stockQuantity;
    } else {
      stocks[stocks.length].quantity = stockQuantity;
      stocks[stocks.length].companyName = companyName;
    }
    currentBalance -= stockQuantity * currentPrice;
    await User.updateOne({ username }, { currentBalance, stocks });

    res.send({ message: 'Bought' });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.sell = async (req, res) => {
  try {
    const { username, companyName, stockQuantity } = req.body;
    //todo : implement socket to emit stocks and users
    const { availability, currentPrice } = await Stock.findOne({ companyName });
    let { currentBalance, stocks } = await User.findOne({ username });

    const stockIndex = stocks.findIndex(
      (stock) => stock.companyName === companyName
    );

    if (stockIndex < 0 || !availability || !currentPrice) {
      return res.status(500).send({ message: `Stock doesn't exist.` });
    }
    if (stocks[stockIndex].quantity < stockQuantity) {
      return res
        .status(400)
        .send({ message: `You can't sell more than your available shares.` });
    }

    stocks[stockIndex].quantity -= stockQuantity;

    const decrementCoefficient = stockQuantity / availability;
    await Stock.findOneAndUpdate(
      { companyName },
      {
        $set: {
          currentPrice: currentPrice * (1 - decrementCoefficient),
          availability: availability + stockQuantity,
        },
      }
    );
    //TODO : update user stocks
    currentBalance += stockQuantity * currentPrice;
    await User.updateOne({ username }, { currentBalance, stocks });

    res.send({ message: 'Sold' });
  } catch (err) {
    res.status(500).send(err);
  }
};
