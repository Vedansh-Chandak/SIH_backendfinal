const express = require('express');
const mongoose = require('mongoose');

const Blockchain = require('./blockchain');
const { Herb, validateHerb } = require('./Schema/herbschema.js');
const { User, validateUser } = require('./Schema/userSchema.js');
const blockRoutes = require("./Routes/blockroutes.js");
const Block = require("./models/Block.js");
const { HerbTransport, validateHerbTransport } = require("./Schema/transportSchema.js");
const { HerbProcessing } = require("./Schema/processSchema.js");
const LabProcessing = require("./Schema/labSchema.js");
const manufactureSchema = require("./Schema/manufactureSchema.js")



require('dotenv').config();

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sih-frontend-lyart.vercel.app",
    ],
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
  })
);

app.options("*", cors()); // <– allow preflight
app.use(express.json());

// Block router
app.use("/api/block", blockRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB Error:", err));

// Initialize blockchain
const blockchain = new Blockchain();

// Basic route
app.get('/', (req, res) => {
    res.send('Herb backend is running');
});
app.get("/*", (req, res) => {
  res.send("Not found");
});

app.get("/:path(*)", (req, res) => {
  res.send("Not found");
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========================== USER REGISTRATION ==========================
app.post("/api/users/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error);

  const { name, age, region, phoneNumber, verificationId, role,  password, gender } = req.body;

  try {
    const userExists = await User.findOne({ verificationId });
    if (userExists) return res.status(400).send("User already registered");

    const user = new User({ name, age, region, phoneNumber, verificationId, role, password, gender });
    await user.save();

    res.send({ message: `${role} registered successfully`, user });
  } catch (err) {
    res.status(500).send({ error: "Database error", details: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // If the user is found, send their details in the response.
    res.status(200).json({ success: true, user });

  } catch (err) {
   
    console.error(err); 
    res.status(500).json({ success: false, error: "An internal server error occurred" });
  }
});

// ========================== ROLE-BASED DASHBOARDS ==========================
app.get("/api/users/:role/:id/dashboard", async (req, res) => {
  const { role, id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send({ message: "User not found" });

    if (user.role !== role) {
      return res.status(403).send({ message: `Access denied. Not a ${role}.` });
    }

    res.send({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`, user });
  } catch (err) {
    res.status(500).send({ error: "Database error", details: err.message });
  }
});


// Login route
app.post("/login", async (req, res) => {
  const { verificationId, password } = req.body;

  if (!verificationId) 
    return res.status(400).send({ error: "verificationId is required" });

  try {
    const user = await User.findOne({ verificationId });
    if (!user) return res.status(404).send({ error: "User not found" });

    // Conditional password check
    if (user.role !== "farmer") {
      if (!password) {
        return res.status(400).send({ error: "Password is required for this role" });
      }
      if (user.password !== password) {
        return res.status(401).send({ error: "Invalid password" });
      }
    }

    res.send({
      message: `Login successful for ${user.role}`,
      user
    });
  } catch (err) {
    res.status(500).send({ error: "Database error", details: err.message });
  }
});

// ========================== HERB ROUTES ==========================
app.post("/herbs", async (req, res) => {
  const { herbName, date, quantity, geoLocation, farmerId, city, address, county, pincode, qrPayload, qrImage } = req.body;

  // Validate herb input
  if (!validateHerb(req.body)) {
    return res.status(400).json({ success: false, error: "Invalid herb data" });
  }

  try {
    // Verify farmer exists and has role = farmer
    const farmer = await User.findById(farmerId);
    if (!farmer) return res.status(404).json({ success: false, error: "Farmer not found" });
    if (farmer.role !== "farmer") return res.status(400).json({ success: false, error: "Only farmers can add herbs" });

    // Add herb data to blockchain
    const newBlock = blockchain.addBlock({
      herbName,
      date,
      quantity,
      geoLocation,
      city,
      address,
      county,
      pincode,
      qrPayload,
      qrImage,
      farmerId
    });

    // Save herb in DB
    const herb = new Herb({
      herbName,
      date,
      quantity,
      geoLocation,
      city,
      address,
      county,
      pincode,
      qrPayload,
      qrImage,
      farmer: farmerId
    });
    const savedHerb = await herb.save();

    // Save block in DB
    const blockDoc = new Block(newBlock);
    const savedBlock = await blockDoc.save();

    res.json({ success: true, herb: savedHerb, block: savedBlock });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================== GET Herb by ID ==========================
app.get("/herbs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find herb by ID and populate farmer details if needed
    const herb = await Herb.findById(id);

    if (!herb) {
      return res.status(404).json({ success: false, error: "Herb not found" });
    }

    res.json({ success: true, herb });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});




// ========================== TRANSPORT ROUTE ==========================
app.post("/transport", async (req, res) => {
  try {
    const data = req.body;

    // ✅ Validate
    if (!validateHerbTransport(data)) {
      return res.status(400).json({ success: false, error: "Invalid transport data" });
    }

    // ✅ Save Transport in MongoDB
    const transportDoc = new HerbTransport(data);
    const savedTransport = await transportDoc.save();

    // ✅ Save in Blockchain
    const blockData = {
      transportId: savedTransport._id.toString(), // link to DB
      herbName: savedTransport.herbName,
      date: savedTransport.date,
      quantity: savedTransport.quantity,
      geoLocation: savedTransport.geoLocation,
      city: savedTransport.city,
      address: savedTransport.address,
      county: savedTransport.county,
      pincode: savedTransport.pincode,
      farmerId: savedTransport.farmerId,
      farmerName: savedTransport.farmerName,
      transportCity: savedTransport.transportCity,
      transportPincode: savedTransport.transportPincode,
      transportGeoLocation: savedTransport.transportGeoLocation,
      driverName: savedTransport.driverName,
      vehicleNumber: savedTransport.vehicleNumber,
      transportQuantity: savedTransport.transportQuantity
    };

    const newBlock = blockchain.addBlock(blockData);
    const blockDoc = new Block(newBlock);
    const savedBlock = await blockDoc.save();

    res.status(201).json({
      success: true,
      transport: savedTransport,
      block: savedBlock
    });
  } catch (err) {
    console.error("❌ Error saving transport:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================== PATCH Transport QR ==========================
app.patch("/transport/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { qrPayload, qrImage } = req.body;

    // Find transport by ID
    const transport = await HerbTransport.findById(id);
    if (!transport) return res.status(404).json({ success: false, error: "Transport not found" });

    // Update QR fields
    if (qrPayload) transport.qrPayload = qrPayload;
    if (qrImage) transport.qrImage = qrImage;

    await transport.save();

    res.json({ success: true, transport });
  } catch (err) {
    console.error("Error updating transport QR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ========================== GET Transport by ID ==========================
app.get("/transport/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find transport record in MongoDB
    const transport = await HerbTransport.findById(id);

    if (!transport) {
      return res.status(404).json({ success: false, error: "Transport record not found" });
    }

    // Find corresponding block (if exists)
    const block = await Block.findOne({ "data.herbName": transport.herbName, "data.date": transport.date });

    res.json({
      success: true,
      transport,
      block: block || null // return null if no block found
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================== HERB PROCESSING ROUTE ==========================


app.post("/processing", async (req, res) => {
  try {
    // 1️⃣ Save full record in MongoDB
    const processing = new HerbProcessing(req.body);
    const savedProcessing = await processing.save();

    // 2️⃣ Save the same full record in Blockchain
    const newBlock = blockchain.addBlock(savedProcessing.toObject());

    const blockDoc = new Block(newBlock);
    const savedBlock = await blockDoc.save();

    res.json({ success: true, processing: savedProcessing, block: savedBlock });
  } catch (err) {
    console.error("Processing Save Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch("/processing/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { qrPayload, qrImage } = req.body;

    const processing = await HerbProcessing.findById(id);
    if (!processing) return res.status(404).json({ success: false, error: "Processing not found" });

    if (qrPayload) processing.qrPayload = qrPayload;
    if (qrImage) processing.qrImage = qrImage;

    await processing.save();
    res.json({ success: true, processing });
  } catch (err) {
    console.error("Error updating processing QR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// ========================== GET Processing by ID ==========================
app.get("/processing/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find processing record in MongoDB
    const processing = await HerbProcessing.findById(id);
    if (!processing) {
      return res.status(404).json({ success: false, error: "Processing record not found" });
    }

    // 2️⃣ Find matching block in DB (based on herbName + date or _id)
    const block = await Block.findOne({ "data._id": id });

    res.json({
      success: true,
      processing,
      block: block || null
    });
  } catch (err) {
    console.error("Error fetching processing record:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ========================== POST LAB PROCESSING ==========================
app.post("/lab", async (req, res) => {
  try {
    // 1️⃣ Save full record in MongoDB
    const labProcessing = new LabProcessing(req.body);
    const savedLabProcessing = await labProcessing.save();

    // 2️⃣ Save the same full record in Blockchain
    const newBlock = blockchain.addBlock(savedLabProcessing.toObject());

    // Save block in DB
    const blockDoc = new Block(newBlock);
    const savedBlock = await blockDoc.save();

    res.json({
      success: true,
      labProcessing: savedLabProcessing,
      block: savedBlock
    });
  } catch (err) {
    console.error("Lab Processing Save Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /lab/:id
app.patch("/lab/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { qrPayload, qrImage } = req.body;

    if (!qrPayload || !qrImage) {
      return res.status(400).json({ success: false, error: "qrPayload and qrImage are required" });
    }

    // Find the lab record by ID and update
    const updatedLab = await LabProcessing.findByIdAndUpdate(
      id,
      { qrPayload, qrImage },
      { new: true } // return the updated document
    );

    if (!updatedLab) {
      return res.status(404).json({ success: false, error: "Lab record not found" });
    }

    res.json({ success: true, labProcessing: updatedLab });
  } catch (err) {
    console.error("❌ Error updating lab QR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ========================== GET LAB PROCESSING BY MONGODB ID ==========================
app.get("/lab/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find lab processing record in MongoDB
    const labProcessing = await LabProcessing.findById(id);

    if (!labProcessing) {
      return res.status(404).json({ success: false, error: "Lab processing record not found" });
    }

    // 2️⃣ Find corresponding block in blockchain (by farmerId for example)
    const block = blockchain.chain.find(
      b => b.data && b.data.farmerId === labProcessing.farmer
    );

    // 3️⃣ Return both DB record and blockchain data
    res.json({
      success: true,
      labProcessing,
      block: block || null
    });

  } catch (err) {
    console.error("Error fetching lab processing record:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================== POST Full Supply Chain ==========================
app.post("/manufacture", async (req, res) => {
  try {
    const {
      herbName,
      date,
      quantity,
      geoLocation,
      city,
      address,
      county,
      pincode,
      farmerId,
      farmerName,
      qrPayload,
      qrImage,
      transportCity,
      transportPincode,
      transportGeoLocation,
      driverName,
      vehicleNumber,
      transportQuantity,
      processingUnitName,
      processes,
      labName,
      qualityAssurance,
      certificates,
      moistureContent,
      purityLevel,
      pesticideLevel,
      activeCompoundLevel,
      collected,
      processed,
      labVerified,
      dispatched,
      companyName,
   manufactureDate,
   productName
    } = req.body;

    // 1️⃣ Save to MongoDB
    const fullRecord = new manufactureSchema({
      herbName,
      date,
      quantity,
      geoLocation,
      city,
      address,
      county,
      pincode,
      farmerId,
      farmerName,
      qrPayload,
      qrImage,
      transportCity,
      transportPincode,
      transportGeoLocation,
      driverName,
      vehicleNumber,
      transportQuantity,
      processingUnitName,
      processes,
      labName,
      qualityAssurance,
      certificates,
      moistureContent,
      purityLevel,
      pesticideLevel,
      activeCompoundLevel,
      collected,
      processed,
      labVerified,
      dispatched,
      companyName,
   manufactureDate,
   productName
    });

    const savedRecord = await fullRecord.save();

    // 2️⃣ Save in blockchain (all details)
    const newBlock = blockchain.addBlock(savedRecord.toObject());

    // Optionally save block in DB if you have Block model
    const blockDoc = new Block(newBlock);
    const savedBlock = await blockDoc.save();

    res.json({
      success: true,
      manufactureSchema: savedRecord,
      block: savedBlock
    });

  } catch (err) {
    console.error("Error saving manufacture record:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /manufacture/:id
app.patch("/manufacture/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 1️⃣ Update the manufacture record
    const updatedRecord = await manufactureSchema.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ success: false, error: "Manufacture record not found" });
    }

    // 2️⃣ Optional: Update blockchain (if you want to log updates)
    const newBlock = blockchain.addBlock(updatedRecord.toObject());
    const blockDoc = new Block(newBlock);
    const savedBlock = await blockDoc.save();

    res.json({
      success: true,
      manufactureSchema: updatedRecord,
      block: savedBlock
    });
  } catch (err) {
    console.error("Error patching manufacture record:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ========================== GET Manufacture Details for Consumer ==========================
app.get("/consumer/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch record from MongoDB
    const manufactureRecord = await manufactureSchema.findById(id);

    if (!manufactureRecord) {
      return res.status(404).json({ success: false, error: "Manufacture record not found" });
    }

    // Optionally, fetch block from blockchain DB if you want
    const blockRecord = await Block.findOne({ "data._id": id });

    res.json({
      success: true,
      manufacture: manufactureRecord,
      block: blockRecord || null
    });

  } catch (err) {
    console.error("Error fetching manufacture record:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Import all models***********Dashboard***********
// Import all models *********** Dashboard ***********
app.get("/dashboard/:role/:id", async (req, res) => {
  const { role, id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid user ID" });
  }

  try {
    // Find user by ID
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // ===== RBA: Only allow access if role matches =====
    if (user.role !== role) {
      return res
        .status(403)
        .json({ success: false, error: `Access denied. Not a ${role}.` });
    }

    // Map roles to blockchain field names
    const roleFieldMap = {
      farmer: "farmerId",
      transporter: "transporterId",
      processor: "processorId",
      lab: "labId",
      manufacturer: "manufacturerId",
    };

    const field = roleFieldMap[role];
    if (!field) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    // ✅ Fetch blocks from MongoDB (with qr info)
    const blocks = await Block.find({ [`data.${field}`]: id }).select(
      "data timestamp qrPayload qrImage createdAt"
    );

    // Return user details + blocks
    res.json({
      success: true,
      user: {
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        region: user.region,
        gender: user.gender,
        verificationId: user.verificationId,
        qrPayload: user.qrPayload,
        qrImage: user.qrImage,
        age: user.age
      },
      blocks,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ========================== GET Herb QR Data ==========================
app.get("/herbs/:id/qr", async (req, res) => {
  try {
    const { id } = req.params;
    const herb = await Herb.findById(id);

    if (!herb) return res.status(404).json({ success: false, error: "Herb not found" });

    if (!herb.qrImage || !herb.qrPayload) {
      return res.status(404).json({ success: false, error: "QR data not found" });
    }

    res.json({
      success: true,
      qrPayload: herb.qrPayload,
      qrImage: herb.qrImage
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});
// ======================== FARMER BLOCKS ==========================
app.get("/api/users/farmer/:id/blocks", (req, res) => {
  const { id } = req.params;

  // Filter blocks where farmerId matches
  const farmerBlocks = blockchain.chain.filter(
    block => block.data && block.data.farmerId === id
  );

  if (!farmerBlocks.length) {
    return res.status(404).send({ message: "No blockchain records found for this farmer" });
  }

  res.send(farmerBlocks);
});

// Get all blockchain blocks
app.get('/api/blocks', (req, res) => {
    res.send(blockchain.chain);
});


app.use("/api", require("./Routes/ivrRoutes.js"));

const farmerRoutes = require("./Routes/farmerRoutes.js");
app.use("/api/farmer", farmerRoutes);

//register number check
app.use("/ivr", require("./Routes/ivr.js"));



// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


