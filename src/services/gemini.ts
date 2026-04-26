import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export async function askElectionAssistant(query: string, history: { role: "user" | "model", parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: `You are the CivicPulse India Assistant, an expert in the Indian democratic election process and the rules of the Election Commission of India (ECI). 
        Your goal is to help users understand election timelines (Lok Sabha and Vidhan Sabha), voter registration (EPIC card), and voting procedures in a non-partisan, clear, and encouraging way.
        
        Guidelines:
        1. Always be non-partisan. Do not favor any candidate or political party.
        2. If asked about specific voting dates, use your grounding tools to check for the latest ECI schedule for relevant phases.
        3. Explain technical terms like 'Lok Sabha', 'Rajya Sabha', 'Vidhan Sabha', 'EVMS', 'VVPAT', 'Model Code of Conduct', and 'Form 6'.
        4. Guide users on how to use the NVSP (National Voters' Service Portal) and the Voter Helpline App.
        5. Encourage users to verify their names in the Electoral Roll.
        6. Keep responses concise and scannable.
        7. Strongly recommend consulting the official ECI website (eci.gov.in) for the most accurate and legal information.`,
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my database right now. Please try again in a moment or visit USA.gov for reliable election information.";
  }
}
