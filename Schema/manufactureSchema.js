// backend/schema/fullSupplyChainSchema.js
const mongoose = require("mongoose");

const manufactureSchemas = new mongoose.Schema({
  // 🌿 Herb details
  herbName: { type: String, required: true },
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },

  geoLocation: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },

  // Herb location details
  city: { type: String },
  address: { type: String},
  county: { type: String},
  pincode: { type: String},

  // Farmer reference
  farmerId: { type: String },
  farmerName: { type: String},

  // QR-related fields
  qrPayload: { type: String },
  qrImage: { type: String },

  // Transport-specific fields
  transportCity: { type: String},
  transportPincode: { type: String},
  transportGeoLocation: {
    lat: { type: Number},
    long: { type: Number}
  },
  driverName: { type: String},
  vehicleNumber: { type: String},
  transportQuantity: { type: Number},

  // Processing fields
  processingUnitName: { type: String},
  processes: [{ type: String }], // array of processes

  // Lab processing fields
  labName: { type: String},
  qualityAssurance: { type: String },
  certificates: [{ type: String }],
  moistureContent: { type: Number },
  purityLevel: { type: Number },
  pesticideLevel: { type: Number },
  activeCompoundLevel: { type: Number },

  // 🔹 Supply chain stages
  collected: { type: Boolean, default: false },
  processed: { type: Boolean, default: false },
  labVerified: { type: Boolean, default: false },
  dispatched: { type: Boolean, default: false },
   companyName: { type: String },
   manufactureDate: { type: String },
   productName:{type:String}
});

// Create model
const manufactureSchema = mongoose.model("manufactureSchema", manufactureSchemas);

module.exports = manufactureSchema;
