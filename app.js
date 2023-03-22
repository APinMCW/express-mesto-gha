const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes');
const bodyParse = require('body-parser');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParse.json());
app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: '6415e7d0254f450a5ab4d8bf' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
