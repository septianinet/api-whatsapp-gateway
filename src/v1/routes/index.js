const express = require("express");
const router = express.Router();
const botService = require("../../services/bot");

router.route("/").get((req, res) => {
  res.send(`<h2>API Version v1</h2>`);
});

router.route("/groups").get(async (req, res) => {
  try {
    let data = await botService.getAllGroups()
    res.json({
      status: "success",
      data: data
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
})

router.route("/restart-service").get(async (req, res) => {
  try {
    const restart = await botService.restartService()

    console.log(restart)

    res.json({
      status: 'success',
      message: 'Service restarted!'
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message
    })
  }
})

router.route("/screenshot").get(async (req, res) => {
  try {
    const buffer = await botService.screenshot();
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error taking screenshot' });
  }
})

router.route("/send-message").post(async (req, res) => {
  try {
    if (req.body.isGroupMsg && req.body.groupId && req.body.isGroupMsg === 1) {
      await botService.sendGroupMessage(req.body)
    } else {
      await botService.sendMessage(req.body);
    }

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
  try {
    await botService.sendBlastMessage(req.body);
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
