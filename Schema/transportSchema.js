const mongoose = require("mongoose");

const HerbTransportSchema = new mongoose.Schema(
  {
    // 🔗 Link to Crop (THIS WILL COME FROM FARMER REGISTRATION)
    cropId: { type: String, required: true },

    // 🌿 Herb Details
    herbName: { type: String, required: true },
    date: { type: Date, default: Date.now }, // auto set
    quantity: { type: Number, required: true }, // registered qty

    // 📍 Farm Location
    geoLocation: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true }
    },

    city: { type: String, required: true },
    address: { type: String, required: true },
    county: { type: String, required: true },
    pincode: { type: String, required: true },

    // 🧑‍🌾 Farmer Details
    farmerId: { type: String, required: true },
    farmerName: { type: String, required: true },

    // 🆕 QR Code
    qrPayload: String,
    qrImage: String,

    // 🚚 Transport Info
    transportCity: { type: String, required: true },
    transportPincode: { type: String, required: true },

    transportGeoLocation: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true }
    },

    driverName: { type: String, required: true },
    vehicleNumber: { type: String, required: true },

    transportQuantity: {
      type: Number,
      required: true,
      // ❗ should be <= registered quantity
      max: function () {
        return this.quantity;
      }
    }
  },
  { timestamps: true }
);

const HerbTransport = mongoose.model("HerbTransport", HerbTransportSchema);

module.exports = HerbTransport;
