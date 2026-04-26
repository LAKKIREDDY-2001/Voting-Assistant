import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { query, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Using a stable model name
      });

      const chat = model.startChat({
        history: history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.parts[0].text }],
        })),
        generationConfig: {
          maxOutputTokens: 2000,
        },
      });

      const systemInstruction = `You are the CivicPulse India Assistant, an expert in the Indian democratic election process and the rules of the Election Commission of India (ECI). 
      Your goal is to help users understand election timelines (Lok Sabha and Vidhan Sabha), voter registration (EPIC card), and voting procedures in a non-partisan, clear, and encouraging way.
      
      Guidelines:
      1. Always be non-partisan. Do not favor any candidate or political party.
      2. If asked about specific voting dates, provide general guidance based on recent ECI patterns and strongly recommend checking eci.gov.in.
      3. Explain technical terms like 'Lok Sabha', 'Rajya Sabha', 'Vidhan Sabha', 'EVMS', 'VVPAT', 'Model Code of Conduct', and 'Form 6'.
      4. Guide users on how to use the NVSP (National Voters' Service Portal) and the Voter Helpline App.
      5. Encourage users to verify their names in the Electoral Roll.
      6. Keep responses concise and scannable using Markdown.
      7. Always include a disclaimer that users should consult eci.gov.in for official information.`;

      const result = await chat.sendMessage(query);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to fetch response from AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
