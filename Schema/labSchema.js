// ========================== LAB PROCESSING SCHEMA ==========================
const mongoose = require("mongoose");

// Define Schema
const labProcessingSchema = new mongoose.Schema({
  // 🌿 Herb Details
  herbName: { type: String, required: true },
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },

  geoLocation: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  city: { type: String, required: true },
  address: { type: String, required: true },
  county: { type: String, required: true },
  pincode: { type: String, required: true },

  // Farmer Info
  farmerId: { type: String },
  farmerName: { type: String, required: true },

  // QR Info
  qrPayload: { type: String },
  qrImage: { type: String },

  // 🚚 Transport Info
  transportCity: { type: String, required: true },
  transportPincode: { type: String, required: true },
  transportGeoLocation: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  driverName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  transportQuantity: { type: Number, required: true },

  // 🏭 Processing Info
  processingUnitName: { type: String, required: true },
  processes: [{ type: String, required: true }], // multiple processes

  // 🔬 Lab & QA Info
  labName: { type: String, required: true },
  qualityAssurance: { type: String, required: true }, // e.g., "Passed", "Failed"
  certificates: [{ type: String }], // multiple certificates

  // 🌿 Herb Testing Factors
  moistureContent: { type: Number, required: true },        // %
  purityLevel: { type: Number, required: true },           // %
  pesticideLevel: { type: Number, required: true },         // e.g., "Safe", "Contaminated"
  activeCompoundLevel: { type: Number, required: true }    // mg/g
});

// Create Model
const LabProcessing = mongoose.model("LabProcessing", labProcessingSchema);

module.exports = LabProcessing;
