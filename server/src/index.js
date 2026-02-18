import "dotenv/config";
import cors from "cors";
import express from "express";
import pkg from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiClient = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Brother API is running",
    endpoints: ["/health", "/chat"],
  });
});

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT 1 as ok");
    res.json({ status: "ok", db: result.rows[0].ok });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/chat", async (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  if (!geminiClient) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  }

  try {
    const model = geminiClient.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You are Brother: a direct, practical, older-brother mentor. Keep replies concise, tough, supportive, and action-oriented. No fluff.",
    });

    const result = await model.generateContent(message);
    const reply = result.response.text().trim();

    return res.json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Brother API running on port ${port}`);
});
