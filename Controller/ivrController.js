const { User } = require("../Schema/userSchema.js");
const { Herb } = require("../Schema/herbschema.js");

exports.registerCrop = async (req, res) => {
  try {
    const { phoneNumber, crop, quantity } = req.body;

    const farmer = await User.findOne({ phoneNumber, role: "farmer" });
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    // 1️⃣ Save Herb in Mongo
    const herb = new Herb({
      herbName: crop,
      quantity,
      date: new Date(),
      farmer: farmer._id,

      // optional fields
      city: farmer.region || "N/A",
      address: "N/A",
      county: "N/A",
      pincode: "N/A",
      geoLocation: { lat: 0, long: 0 }
    });

    const savedHerb = await herb.save();

    // 2️⃣ Save to Blockchain + Block DB so dashboard can see it
    const newBlock = blockchain.addBlock({
      farmerId: farmer._id.toString(),
      herbId: savedHerb._id.toString(),
      herbName: crop,
      quantity,
      date: savedHerb.date
    });

    const blockDoc = new Block(newBlock);
    await blockDoc.save();

    return res.status(201).json({
      success: true,
      message: "Crop registered successfully",
      herb: savedHerb,
      block: newBlock
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

