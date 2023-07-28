const express = require("express");
const router = express.Router();
const botService = require("../../services/bot");

router.route("/").get((req, res) => {
  res.send(`<h2>API Version v1</h2>`);
});

router.route("/send").post(async (req, res) => {
  try {
    await botService.sendMessage(req.body);
    res.json({
      status: "success",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.route("/blast").post(async (req, res) => {
  console.log("body:", req.body);
  console.log("data:", req.body);
  try {
    await botService.sendBlastMessage(req.body.data);
    res.json({
      status: "success",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
