// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   age: { type: Number, required: true },
//   region: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   verificationId: { type: String, required: true, unique: true },
//   role: {
//     type: String,
//     required: true,
//     enum: ["farmer", "transporter", "processor", "lab", "manufacturer"]
//   },
//   password: { type: String },
//   gender: { type : String},
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model("User", userSchema);

// function validateUser(data) {
//   if (
//     typeof data.name !== "string" ||
//     typeof data.age !== "number" ||
//     typeof data.region !== "string" ||
//     typeof data.phoneNumber !== "string" ||
//     typeof data.verificationId !== "string" ||
//     typeof data.role !== "string"
//   ) {
//     return { error: "Invalid user data" };
//   }
//   return { error: null };
// }

// module.exports = { User, validateUser };

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  region: { type: String },
  phoneNumber: { type: String },
  verificationId: { type: String, unique: true },
  role: {
    type: String,
    enum: ["farmer", "transporter", "processor", "lab", "manufacturer"]
  },
  password: { type: String },
  gender: { type: String },
  pincode: { type: String },    // NOT REQUIRED
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Validation (optional fields allowed)
function validateUser(data) {
  return { error: null };
}

module.exports = { User, validateUser };
