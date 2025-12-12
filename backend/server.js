const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


// MongoDB Connection

mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/merndb')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));


// User Schema

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String
}));


// Patient Schema

const Patient = mongoose.model("Patient", new mongoose.Schema({
  name: String,
  age: Number,
  disease: String
}));


// Signup

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashed });
  await user.save();

  res.json({ message: "Signup success" });
});


// Login → Returns Token

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token });
});


// Auth middleware

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.json({ message: "No token" });

  try {
    jwt.verify(token, "secret123");
    next();
  } catch {
    res.json({ message: "Invalid token" });
  }
}



// Read all patients
app.get("/patients", auth, async (req, res) => {
  const data = await Patient.find();
  res.json(data);
});

// Add patient
app.post("/patients", auth, async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.json({ message: "Patient added" });
});

// Update patient
app.put("/patients/:id", auth, async (req, res) => {
  await Patient.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

// Delete patient
app.delete("/patients/:id", auth, async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
