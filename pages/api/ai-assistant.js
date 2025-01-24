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

// Format CV data as a human-readable text
const formatCVDataAsText = (cvData) => {
  if (!cvData) return "No CV data available.";

  const { profile, education, experience, projects, skills, languages } =
    cvData;

  let text = `PROFILE:\nName: ${profile.name}\nTitle: ${profile.title}\n`;
  text += `Birthdate: ${profile.birthdate}\n`; // Added Birthdate here
  text += `Contact: Phone: ${profile.contact.phone}, Email: ${profile.contact.email}, GitHub: ${profile.contact.github}, LinkedIn: ${profile.contact.linkedin}, Portfolio: ${profile.contact.portfolio}\n\n`;

  text += "EDUCATION:\n";
  education.forEach((edu) => {
    text += `- ${edu.degree} at ${edu.institution} (${
      edu.start_date || "N/A"
    } - ${edu.end_date || "N/A"})\n`;
  });

  text += "\nEXPERIENCE:\n";
  experience.forEach((exp) => {
    text += `- ${exp.position} at ${exp.company} (${exp.start_date} - ${
      exp.end_date || "Current"
    })\nResponsibilities:\n  ${exp.responsibilities.join("\n  ")}\n\n`;
  });

  text += "PROJECTS:\n";
  projects.forEach((project) => {
    text += `- ${project.name} (${project.start_date} - ${
      project.end_date || "Current"
    }): ${project.description}\nTechnologies: ${project.technologies.join(
      ", "
    )}\nWebsite: ${project.website || "N/A"}\n\n`;
  });

  text += "SKILLS:\n";
  text += `- Programming Languages: ${skills.programming_languages.join(
    ", "
  )}\n`;
  text += `- Web Technologies: ${skills.web_technologies.join(", ")}\n`;
  text += `- Databases: ${skills.databases.join(", ")}\n`;
  text += `- DevOps: ${skills.devops.join(", ")}\n`;
  text += `- Tools: ${skills.tools.join(", ")}\n`;
  text += `- Methodologies: ${skills.methodologies.join(", ")}\n`;
  text += `- Certifications: ${skills.certifications.join(", ")}\n\n`;

  text += "LANGUAGES:\n";
  for (const [language, level] of Object.entries(languages)) {
    text += `- ${language}: ${level}\n`;
  }

  return text;
};

const cvData = loadCVData();
const formattedCVText = formatCVDataAsText(cvData);

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

      // General-purpose system prompt with formatted CV data
      const systemPrompt = `
        You are Achraf Zarouki, a skilled software engineer. Respond to user queries accurately and concisely. 
        Below is your professional CV:
        
        ${formattedCVText}
        
        Rules for answers:
        - Responses should be short (1-2 sentences maximum).
        - For personal questions like "What is your phone number?", use the CV data.
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
