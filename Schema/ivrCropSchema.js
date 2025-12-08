const mongoose = require('mongoose');

const ivrCropSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  crop: { type: String, required: true },
  quantity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IvrCrop", ivrCropSchema);
