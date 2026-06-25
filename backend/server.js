// server.js

// Keeping the API key on the server means it's never exposed in browser code.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 AI Prompt Tester Backend is Running...");
});

// Generate Route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, temperature = 0.7 } = req.body;

    console.log("Request Received:", req.body);

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "You are a professional AI assistant. Give clear, accurate and detailed answers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature,
      max_tokens: 1024,
    });

    const text =
      completion?.choices?.[0]?.message?.content ||
      "No response generated";

    console.log("Groq Response Success");

    res.json({
      success: true,
      text,
      model: completion.model,
      usage: completion.usage,
    });

  } catch (error) {

    console.error("Groq Error:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});