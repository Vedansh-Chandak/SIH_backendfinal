// const express = require('express');
// const router = express.Router();
// const { User, validateUser } = require('../Schema/userSchema.js');

// // Register new user
// router.post('/register', async (req, res) => {
//   const { error } = validateUser(req.body);
//   if (error) return res.status(400).send(error);

//   const { name, age, region, phoneNumber, role, verificationId } = req.body;

//   try {
//     // Check if verificationId already exists
//     const userExists = await User.findOne({ verificationId });
//     if (userExists) return res.status(400).send('User already registered');

//     const user = new User({ name, age, region, phoneNumber, role, verificationId });
//     await user.save();

//     res.send({ message: `${role} registered successfully`, user });
//   } catch (err) {
//     res.status(500).send({ error: 'Database error', details: err.message });
//   }
// });

// // Get all users
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (err) {
//     res.status(500).send({ error: 'Database error', details: err.message });
//   }
// });

// // Get user by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).send("User not found");
//     res.send(user);
//   } catch (err) {
//     res.status(500).send({ error: 'Database error', details: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const { getUserByPhone } = require("../Controller/userControllers");

router.get("/user/phone/:phoneNumber", getUserByPhone);

module.exports = router;

