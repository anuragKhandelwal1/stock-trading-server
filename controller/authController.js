const User = require('../schemas/user');

exports.signup = async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  try {
    await User.create({
      firstname,
      lastname,
      username,
      password,
      isLoggedIn: false,
      currentBalance: 2500,
    });
    res.status(200).json({ message: 'Signup success' });
  } catch (err) {
    if (err.message.indexOf('duplicate key error') > -1) {
      res.status(400).json({ message: `${username} is already taken` });
    } else {
      res.json(err.message);
    }
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Incorrect Username or Password' });
    }
    if (user.password === password) {
      await User.updateOne({ username }, { isLoggedIn: true });
      res.status(200).json({ message: 'Logged In' });
    } else {
      res.status(401).json({ message: 'Incorrect Username or Password' });
    }
  } catch (err) {
    res.send(err);
  }
};

exports.logout = async (req, res) => {
  const { username } = req.body;
  try {
    await User.updateOne({ username }, { isLoggedIn: false });
    res.status(200).send({ message: 'Logged Out' });
  } catch (err) {
    res.send(err);
  }
};
