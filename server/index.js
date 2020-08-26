require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;
const authRoutes = require('../routes/authRoutes');
const stockRoutes = require('../routes/stockRoutes');
app.enable('trust proxy');

app.use(cors({ origin: '*' }));

app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('connnectin made');
  const onlineUsers = Object.keys(io.engine.clients);
  console.log('online user- ', onlineUsers);

  socket.emit('onlineUsers', JSON.stringify(onlineUsers));
  //   socket.emit('message', 'Welcome to the socket');
  //   io.emit('message', 'Welcome to the io');
});

app.get('/', (req, res) => {
  res.send('App loaded');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stocks', stockRoutes);

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    () => console.log('connected to the db'),
    (err) => console.log('err', err)
  );

http.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
