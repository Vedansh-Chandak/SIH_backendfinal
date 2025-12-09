// backend/schema/herbProcessingSchema.js
const mongoose = require("mongoose");

const herbProcessingSchema = new mongoose.Schema({
  // 🌿 Transport + Herb details
  herbName: { type: String, required: true },
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },

  geoLocation: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },

  // Herb location details
  city: { type: String},
  address: { type: String},
  county: { type: String},
  pincode: { type: String},

  // Farmer reference
  farmerId: { type: String },
  farmerName: { type: String, required: true },

  // 🆕 QR-related fields
  qrPayload: { type: String },
  qrImage: { type: String },

  // 🚚 Transport-specific fields
  transportCity: { type: String},
  transportPincode: { type: String},
  transportGeoLocation: {
    lat: { type: Number},
    long: { type: Number}
  },
  driverName: { type: String},
  vehicleNumber: { type: String},
  transportQuantity: { type: Number},

  // 🏭 Processing unit
  processingUnitName: { type: String,

  // 🔄 Processes (array of steps)
  processes: [
    { type: String} // example: ["Cleaning", "Drying", "Grinding"]
  ]}
});

// Create model
const HerbProcessing = mongoose.model("HerbProcessing", herbProcessingSchema);

module.exports = { HerbProcessing };
