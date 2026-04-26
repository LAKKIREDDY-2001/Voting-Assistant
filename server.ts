import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https://*.google.com", "https://*.googleusercontent.com"],
        "connect-src": ["'self'", "https://*.google.com", "https://*.googleapis.com"],
        "frame-ancestors": ["'self'", "https://*.run.app", "https://ais-*.run.app", "https://*.google.com"],
      },
    },
    frameguard: false, // Allow iframes for the preview
  }));

  console.log("Middlewares initialized");

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests from this IP, please try again after 15 minutes" }
  });

  app.use("/api/", limiter);
  app.use(express.json());

  // Gemini API Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { query, history } = req.body;
      
      // Security: Validate query input
      if (!query || typeof query !== 'string' || query.length > 5000) {
        return res.status(400).json({ error: "Invalid query" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history.map((h: any) => ({
            role: h.role,
            parts: h.parts
          })),
          { role: "user", parts: [{ text: query }] }
        ],
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }]
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to fetch response from AI" });
    }
  });

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Vite middleware for development
  const isDev = process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";
  const distPath = path.resolve(process.cwd(), "dist");

  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Dist Path: ${distPath}`);

  if (isDev) {
    console.log("Starting in DEVELOPMENT mode with Vite middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode, serving static files");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      // Don't intercept API calls that might have fall-through
      if (req.path.startsWith("/api/")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // 404 Fallback Logger
  app.use((req, res) => {
    console.warn(`404 - Not Found: ${req.method} ${req.path}`);
    res.status(404).json({ error: "Route not found", path: req.path });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on port ${PORT}`);
  });
}

startServer();
