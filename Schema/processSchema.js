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
  transportCity: { type: String, required: true },
  transportPincode: { type: String, required: true },
  transportGeoLocation: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  driverName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  transportQuantity: { type: Number, required: true },

  // 🏭 Processing unit
  processingUnitName: { type: String, required: true },

  // 🔄 Processes (array of steps)
  processes: [
    { type: String, required: true } // example: ["Cleaning", "Drying", "Grinding"]
  ]
});

// Create model
const HerbProcessing = mongoose.model("HerbProcessing", herbProcessingSchema);

module.exports = { HerbProcessing };
