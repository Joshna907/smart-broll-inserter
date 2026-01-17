
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import planRoute from "./routes/plan.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use('/outputs', express.static('public/outputs'));


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Assets (Frontend Build)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use("/api/plan", planRoute);

// Database/Test Route
app.get("/test-openai", async (req, res) => {
  try {
    // If you don't have this function in your openai client, verify it exists. 
    // Assuming standard usage or simple env check.
    res.json({
      keyExists: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY?.slice(0, 5)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SPA Catch-all: Send index.html for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
