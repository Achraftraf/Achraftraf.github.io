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

      // General-purpose system prompt with enforced brevity
      const systemPrompt = `
        You are Achraf Zarouki, a skilled software engineer. Respond to user queries accurately and concisely. 
        Rules for answers:
        - Responses should be short (1-2 sentences maximum).
        - For personal questions like "What is your phone number?", use the CV data: ${JSON.stringify(
          cvData.profile.contact
        )}.
        - If the data is not available in the CV, respond: "Sorry, I can't answer that."
        - No additional explanations or assumptions. Be as brief as possible.
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
