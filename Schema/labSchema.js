// ========================== LAB PROCESSING SCHEMA ==========================
const mongoose = require("mongoose");

// Define Schema
const labProcessingSchema = new mongoose.Schema({
  // 🌿 Herb Details
  herbName: { type: String},
  date: { type: Date},
  quantity: { type: Number},

  geoLocation: {
    lat: { type: Number },
    long: { type: Number }
  },
  rating: {
  type: String,
  enum: ["1","2","3","4","5","6","7","8","9","10"],
  required: true
},
  city: { type: String },
  address: { type: String},
  county: { type: String },
  pincode: { type: String},

  // Farmer Info
  farmerId: { type: String },
  farmerName: { type: String},

  // QR Info
  qrPayload: { type: String },
  qrImage: { type: String },

  // 🚚 Transport Info
  transportCity: { type: String},
  transportPincode: { type: String },
  transportGeoLocation: {
    lat: { type: Number},
    long: { type: Number }
  },
  driverName: { type: String},
  vehicleNumber: { type: String },
  transportQuantity: { type: Number},

  // 🏭 Processing Info
  processingUnitName: { type: String},
  processes: [{ type: String}], // multiple processes

  // 🔬 Lab & QA Info
  labName: { type: String},
  qualityAssurance: { type: String}, // e.g., "Passed", "Failed"
  certificates: [{ type: String }], // multiple certificates

  // 🌿 Herb Testing Factors
  moistureContent: { type: Number},        // %
  purityLevel: { type: Number},           // %
  pesticideLevel: { type: Number},         // e.g., "Safe", "Contaminated"
  activeCompoundLevel: { type: Number}    // mg/g
});

// Create Model
const LabProcessing = mongoose.model("LabProcessing", labProcessingSchema);

module.exports = LabProcessing;
