require("dotenv").config();

const bot = require("./services/bot")
const express = require("express");
const v1Router = require("./v1/routes");

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 14045;

app.get("/", (req, res) => {
  res.send("<h2>It's Working!</h2>");
});
app.use("/api/v1", v1Router);

app.listen(PORT, () => {
  bot.waInit()
  console.log(`API is listening on port ${PORT}`);
});
