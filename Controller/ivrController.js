const User = require("../Schema/userSchema.js").User;
const IvrCrop = require("../Schema/ivrCropSchema.js");

exports.registerCrop = async (req, res) => {
  try {
    const { phoneNumber, crop, quantity } = req.body;

    if (!phoneNumber || !crop || !quantity)
      return res.status(400).send({ status: "EXIT", error: "Missing IVR data" });

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(200).send({
        status: "EXIT",
        message: "User not registered"
      });
    }

    const data = new IvrCrop({ phoneNumber, crop, quantity });
    await data.save();

    return res.status(200).send({
      status: "OK",
      message: "Crop saved",
      id: data._id,
      crop,
      quantity
    });

  } catch (err) {
    res.status(500).send({ status: "EXIT", error: "DB error" });
  }
};
