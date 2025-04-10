const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

dotenv.config();

const app = express();
const port = 3000;
const dbName = "Passop";
const collectionName = "passwords";
const mongoURL = process.env.MONGO_URI || "mongodb://localhost:27017";

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Match frontend port
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));
app.use(bodyParser.json());

const client = new MongoClient(mongoURL);

const connectToMongo = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

connectToMongo();

// GET all passwords
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const passwords = await db.collection(collectionName).find({}).toArray();
    res.json(passwords);
  } catch (err) {
    console.error("GET / error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch passwords" });
  }
});

// POST new password
app.post("/", async (req, res) => {
  try {
    const newPassword = req.body;
    if (!newPassword || !newPassword.id) {
      return res.status(400).json({ success: false, message: "Invalid request body" });
    }

    const db = client.db(dbName);
    const result = await db.collection(collectionName).insertOne(newPassword);
    res.status(201).json({ success: true, result });
  } catch (err) {
    console.error("POST / error:", err);
    res.status(500).json({ success: false, message: "Failed to save password" });
  }
});

// DELETE password by id
app.delete("/", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "ID is required for deletion" });
    }

    const db = client.db(dbName);
    const result = await db.collection(collectionName).deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Password not found" });
    }

    res.json({ success: true, message: "Password deleted", result });
  } catch (err) {
    console.error("DELETE / error:", err);
    res.status(500).json({ success: false, message: "Failed to delete password" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
