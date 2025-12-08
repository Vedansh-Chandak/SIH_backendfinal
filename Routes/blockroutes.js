const express = require("express");
const router = express.Router();
const Block = require("../models/Block.js");

// GET block by hash
router.get("/:hash", async (req, res) => {
  try {
    const block = await Block.findOne({ hash: req.params.hash });
    if (!block) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }
    res.json({ success: true, block });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
