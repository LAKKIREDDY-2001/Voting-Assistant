export async function askElectionAssistant(query: string, history: { role: "user" | "model", parts: { text: string }[] }[] = []) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, history }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my database right now. Please try again in a moment or visit eci.gov.in for reliable election information.";
  }
}
