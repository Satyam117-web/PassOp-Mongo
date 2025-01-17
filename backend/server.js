const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")
const cors = require("cors")
const { MongoClient } = require("mongodb")

dotenv.config();

const url = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "Passop";
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors())


client.connect().then(() => console.log("Connected to MongoDB"));

app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/", async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.insertOne(password);
    res.json({ success: true, result: findResult });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.delete("/", async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.deleteOne(password);
    res.json({ success: true, result: findResult });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
