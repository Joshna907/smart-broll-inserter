import express from "express";
import { generateTimelinePlan } from "../services/timeline.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const input = req.body;
    const plan = await generateTimelinePlan(input);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
