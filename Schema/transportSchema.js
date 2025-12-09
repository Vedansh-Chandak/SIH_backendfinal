// const mongoose = require("mongoose");

// const HerbTransportSchema = new mongoose.Schema(
//   {
//     // 🔗 Link to Crop (THIS WILL COME FROM FARMER REGISTRATION)
//     cropId: { type: String, required: true },

//     // 🌿 Herb Details
//     herbName: { type: String, required: true },
//     date: { type: Date, default: Date.now }, // auto set
//     quantity: { type: Number, required: true }, // registered qty

//     // 📍 Farm Location
//     geoLocation: {
//       lat: { type: Number,  },
//       long: { type: Number, }
//     },

//     city: { type: String},
//     address: { type: String},
//     county: { type: String},
//     pincode: { type: String},

//     // 🧑‍🌾 Farmer Details
//     farmerId: { type: String, required: true },
//     farmerName: { type: String, required: true },

//     // 🆕 QR Code
//     qrPayload: String,
//     qrImage: String,

//     // 🚚 Transport Info
//     transportCity: { type: String },
//     transportPincode: { type: String},

//     transportGeoLocation: {
//       lat: { type: Number },
//       long: { type: Number }
//     },

//     driverName: { type: String, required: true },
//     vehicleNumber: { type: String, required: true },

//     transportQuantity: {
//       type: Number,
//       required: true,
//       // ❗ should be <= registered quantity
//       max: function () {
//         return this.quantity;
//       }
//     }
//   },
//   { timestamps: true }
// );

// const HerbTransport = mongoose.model("HerbTransport", HerbTransportSchema);

// module.exports = HerbTransport;


const mongoose = require("mongoose");

const HerbTransportSchema = new mongoose.Schema(
  {
    cropId: { type: String},

    herbName: { type: String},
    date: { type: Date, default: Date.now },
    quantity: { type: Number},

    geoLocation: {
      lat: { type: Number },
      long: { type: Number }
    },

    city: { type: String },
    address: { type: String },
    county: { type: String },
    pincode: { type: String },

    farmerId: { type: String},
    farmerName: { type: String},

    qrPayload: String,
    qrImage: String,

    transportCity: { type: String },
    transportPincode: { type: String },

    transportGeoLocation: {
      lat: { type: Number },
      long: { type: Number }
    },

    driverName: { type: String},
    vehicleNumber: { type: String },

    transportQuantity: {
      type: Number,
      required: true,
      max: function () {
        return this.quantity;
      }
    }
  },
  { timestamps: true }
);

const HerbTransport = mongoose.model("HerbTransport", HerbTransportSchema);

module.exports = HerbTransport;
