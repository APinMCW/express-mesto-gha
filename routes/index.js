const router = require("express").Router();

const userRoutes = require("./users");
const cardRoutes = require("./cards");

router.use("/cards", cardRoutes);
router.use("/users", userRoutes);
router.use((req, res) => {
  res.status(500).send({ error: "Ошибка по умолчанию." });
});

module.exports = router;
