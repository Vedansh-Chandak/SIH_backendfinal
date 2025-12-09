const { User } = require("../Schema/userSchema.js");
const IvrCrop = require("../Schema/ivrCropSchema.js");

/**
 * Register crop from IVR (expects JSON body with phoneNumber, crop, quantity)
 * Responds with status field (OK / EXIT) so IVR system can parse easily.
 */
exports.registerCrop = async (req, res) => {
  try {
    const { phoneNumber, crop, quantity } = req.body;

    // Validate
    if (!phoneNumber || !crop || !quantity) {
      return res.status(400).send({
        status: "EXIT",
        message: "Missing required IVR data (phoneNumber, crop, quantity)"
      });
    }

    // Check user registration
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(200).send({
        status: "EXIT",
        message: "User not registered with this number"
      });
    }

    // Save crop data
    const entry = await IvrCrop.create({
      phoneNumber,
      crop,
      quantity
    });

    return res.status(200).send({
      status: "OK",
      message: "Crop saved successfully",
      id: entry._id,
      crop: entry.crop,
      quantity: entry.quantity
    });

  } catch (err) {
    console.error("IVR registerCrop error:", err);
    return res.status(500).send({
      status: "EXIT",
      message: "Internal server error"
    });
  }
};
