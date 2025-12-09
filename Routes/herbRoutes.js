const express = require("express");
const router = express.Router();
const { registerHerbByPhone } = require("../Controller/herbController");

router.post("/herbs/registerByPhone", registerHerbByPhone);

module.exports = router;
