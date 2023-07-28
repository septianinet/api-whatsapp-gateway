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
  console.log(req.body);
  try {
    await botService.sendBlastMessage(req.body);
    // await botService.sendBlastMessage(
    //   JSON.stringify({
    //     data: "U2FsdGVkX18XYVNp20eX86uOPWZisKhgU8pteF3YBK4Fc2jQdbFFHgjt/D56vr4fulZcAxghJcZchsISR0OTTHdf4ztc6bI1zHtwr5AlfxM4nL1EQ8PSIqmgjucKMnlq",
    //   })
    // );
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
