const User = require("../Schema/userSchema.js").User;
const IvrCrop = require("../Schema/ivrCropSchema.js");

exports.registerCrop = async (req, res) => {
  try {
    const { phoneNumber, crop, quantity } = req.body;

    if (!phoneNumber || !crop || !quantity)
      return res.status(400).send("Missing IVR data");

    // 1️⃣ Check if user exists by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).send({ error: "User not registered" });
    }

    // 2️⃣ Save crop entry
    const data = new IvrCrop({ phoneNumber, crop, quantity });
    await data.save();

    res.status(200).send({
      message: "Crop registered via IVR successfully",
      data
    });

  } catch (err) {
    console.error("IVR DB error:", err);
    res.status(500).send("Server error");
  }
};
