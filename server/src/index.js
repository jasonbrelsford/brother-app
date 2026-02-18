import "dotenv/config";
import cors from "cors";
import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

const openclawGatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
const openclawGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
const openclawAgentId = process.env.OPENCLAW_AGENT_ID || "main";

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
    res.json({
      status: "ok",
      db: result.rows[0].ok,
      openclawConfigured: Boolean(openclawGatewayUrl && openclawGatewayToken),
    });
  } catch (error) {
    console.error("Health check failed", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/chat", async (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  if (!openclawGatewayUrl || !openclawGatewayToken) {
    return res.status(500).json({ error: "OpenClaw gateway is not configured" });
  }

  try {
    const response = await fetch(`${openclawGatewayUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openclawGatewayToken}`,
        "x-openclaw-agent-id": openclawAgentId,
      },
      body: JSON.stringify({
        model: "openclaw",
        messages: [
          {
            role: "system",
            content:
              "You are Brother: a direct, practical, older-brother mentor. Keep replies concise, tough, supportive, and action-oriented. No fluff.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.error || "OpenClaw error";
      throw new Error(`${errorMessage} (${response.status})`);
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || "";
    return res.json({ reply: reply || "No reply." });
  } catch (error) {
    console.error("OpenClaw error", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Brother API running on port ${port}`);
});
