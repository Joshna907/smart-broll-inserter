
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import planRoute from "./routes/plan.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use('/outputs', express.static('public/outputs'));


app.use("/api/plan", planRoute);

app.get("/", (req, res) => {
  res.send("Smart B-roll Inserter Backend Running");
});
app.get("/test-openai", async (req, res) => {
  try {
    res.json({
      keyExists: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY?.slice(0, 5)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
