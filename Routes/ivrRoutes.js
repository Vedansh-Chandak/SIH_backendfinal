const express = require("express");
const router = express.Router();
const { registerCrop } = require("../Controller/ivrController.js");

// FINAL correct route:
// POST /api/registerCrop
router.post("/registerCrop", registerCrop);

module.exports = router;
