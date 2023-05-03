const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const errorHandler = require('./middlewares/error-handler');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
