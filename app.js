const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => console.log('Connected!'));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6480bc0b5535b896735e95d6',
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.use((req, res) => {
  // Handle the 404 error
  console.log('error')

  // const error = new Error('page not found');
  // error.status = 404;
  // res.send(error);
  res
    .status(404)
    .send({
      message: 'User not found',
    });
}
);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});
