const express = require("express");
const router = express.Router();

const { User } = require("../Schema/userSchema");
const LabProcessing = require("../Schema/labSchema.js");


// 🔹 Check phone registered or not
router.get("/check-number", async (req, res) => {
  const phone = req.query.phone;

  if (!phone)
    return res.status(400).json({ success: false, message: "phone required" });

  try {
    const user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      return res.json({
        success: false,
        registered: false,
        message: "Number is not registered"
      });
    }

    return res.json({
      success: true,
      registered: true,
      name: user.name,
      role: user.role,
      id: user._id
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// 🔹 Get all herbs by farmer number
router.get("/herbs", async (req, res) => {
  const phone = req.query.phone;

  if (!phone) return res.status(400).json({ message: "phone required" });

  try {
    const user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      return res.json({
        success: false,
        message: "Farmer not registered"
      });
    }

    const herbs = await LabProcessing.find({ farmerId: user._id });

    return res.json({
      success: true,
      farmerName: user.name,
      phone: phone,
      totalHerbs: herbs.length,
      herbs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


module.exports = router;
