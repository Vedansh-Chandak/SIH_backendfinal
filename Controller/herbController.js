const { User } = require("../Schema/userSchema");
const { Herb, validateHerb } = require("../Schema/herbschema");

exports.registerHerbByPhone = async (req, res) => {
  try {
    const { phoneNumber, herbName, quantity } = req.body;

    // Validate required fields
    if (!phoneNumber || !herbName || !quantity) {
      return res.status(400).json({
        success: false,
        message: "phoneNumber, herbName and quantity are required"
      });
    }

    // Find farmer by phone number
    const farmer = await User.findOne({ phoneNumber });

    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    if (farmer.role !== "farmer") {
      return res.status(400).json({
        success: false,
        message: "Only farmers can register herbs"
      });
    }

    // Create herb data with farmer ID
    const herb = new Herb({
      herbName,
      quantity,
      date: new Date(),             // auto timestamp
      farmer: farmer._id,
      region: farmer.region,        // optional (if you want to store)
      geoLocation: null,            // optional
      city: farmer.region,
      address: farmer.region,
      county: null,
      pincode: farmer.pincode,
      qrPayload: null,
      qrImage: null
    });

    const savedHerb = await herb.save();

    res.json({
      success: true,
      message: "Herb registered successfully",
      herb: savedHerb,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        region: farmer.region,
        address:farmer.region,
        phoneNumber: farmer.phoneNumber,
        pincode: farmer.pincode
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
