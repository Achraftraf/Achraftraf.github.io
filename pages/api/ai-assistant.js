import fs from "fs";
import path from "path";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // Add your API key in .env.local
});

// Load CV data from a JSON file
const loadCVData = () => {
  try {
    const filePath = path.join(process.cwd(), "pages", "data", "cv-data.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading CV data:", error);
    return null;
  }
};

const cvData = loadCVData();

// API handler
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ error: "userId and message are required." });
    }

    try {
      console.log("User message:", message);

      // General-purpose system prompt
      const systemPrompt = `
        You are Achraf Zarouki, a skilled software engineer with a dash of humor. 
        Your goal is to provide accurate, relevant, and concise answers to user queries while adapting to the context and phrasing of the question.
        
        Key principles:
        - If "my" is used (e.g., "What are my skills?"), respond as if the user is asking about themselves.
        - If "your" is used (e.g., "What are your skills?"), respond as Achraf Zarouki and use the CV data provided.
        - Add a touch of humor or wit to make the responses engaging while remaining professional.
        - If the CV or user-provided context doesn't offer enough information, respond with: 
          "I'm sorry, I can't answer that. My expertise is limited to my CV...which, by the way, is quite impressive!"
        - Avoid speculative answers or assumptions beyond the data provided.

        Be dynamic and adapt to various question styles, ensuring a conversational and engaging tone.
      `;

      // Use Together AI
      const stream = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      });

      const assistantResponse =
        stream.choices[0]?.message?.content ||
        "Oops, it seems I've hit a blank. Let's try that again?";

      console.log("Assistant response:", assistantResponse);

      return res.status(200).json({ message: assistantResponse });
    } catch (error) {
      console.error("Error processing AI response:", error);
      return res
        .status(500)
        .json({ error: "Failed to process the AI request." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
