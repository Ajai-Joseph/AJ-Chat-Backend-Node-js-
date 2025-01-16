const { getToken } = require("../controllers/callController");

const express = require("express");
const router = express.Router();

router.get("/getToken", getToken);

module.exports = router;
