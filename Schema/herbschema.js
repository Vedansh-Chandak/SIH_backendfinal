// backend/schema/herbSchema.js
const mongoose = require('mongoose');

// define the Mongoose schema
const herbSchema = new mongoose.Schema({
  herbName: { type: String},
  date: { type: Date},
  quantity: { type: Number},

  geoLocation: {
    lat: { type: Number },
    long: { type: Number }
  },

  // 🆕 Location details
  city: { type: String },
  address: { type: String  },
  county: { type: String },
  pincode: { type: String},

  // Farmer reference
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },

  // 🆕 QR-related fields
  qrPayload: { type: String },   // raw JSON/string stored in QR
  qrImage: { type: String }      // Base64 encoded QR image
});

// create the Mongoose model
const Herb = mongoose.model('Herb', herbSchema);

// optional: validation function
function validateHerb(data) {
  if (
    typeof data.herbName !== 'string' ||
    !(new Date(data.date).toString() !== 'Invalid Date') || // checks valid date
    typeof data.quantity !== 'number' ||
    typeof data.geoLocation !== 'object' ||
    typeof data.geoLocation.lat !== 'number' ||
    typeof data.geoLocation.long !== 'number' ||
    typeof data.city !== 'string' ||
    typeof data.address !== 'string' ||
    typeof data.county !== 'string' ||
    typeof data.pincode !== 'string' ||
    typeof data.farmerId !== 'string'
  ) {
    return false;
  }
  return true;
}

module.exports = { Herb, validateHerb };
