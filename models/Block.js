const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  index: Number,
  timestamp: Number,
  data: {
    herbName: String,
    date: String,
    quantity: Number,
    geoLocation: {
      lat: Number,
      long: Number,
    },
    farmerId: String,
  },
  previousHash: String,
  hash: { type: String, unique: true },
});

module.exports = mongoose.model("Block", BlockSchema);
