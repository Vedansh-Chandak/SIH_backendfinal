const express = require("express");
const router = express.Router();
const { registerCrop } = require("../Controller/ivrController.js");

router.post("/ivr/registerCrop", registerCrop);

module.exports = router;
