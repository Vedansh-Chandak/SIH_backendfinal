const express = require("express");
const router = express.Router();

// import model
const LabProcessing = require("../Schema/labSchema.js");

// GET farmer rating
router.get("/rating/:farmerId", async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    const records = await LabProcessing.find({ farmerId });

    const numbers = records
      .map(r => Number(r.rating))
      .filter(n => !isNaN(n));

    const avg =
      numbers.reduce((a, b) => a + b, 0) / numbers.length || 0;

    res.json({ average: avg, ratings: numbers });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

module.exports = router;
