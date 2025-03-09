const { sendNotification } = require("../controllers/pushNotificationController");

const express = require("express");
const router = express.Router();

router.post("/sendNotification", sendNotification);

module.exports = router;
