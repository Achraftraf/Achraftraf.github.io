import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

// Simple in-memory rate limiter with improved cleanup
const rateLimitMap = new Map();

function rateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now();
  
  // Cleanup expired entries on each call (better for serverless)
  for (const [key, requests] of rateLimitMap.entries()) {
    const recent = requests.filter(time => now - time < windowMs);
    if (recent.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recent);
    }
  }

  const userRequests = rateLimitMap.get(identifier) || [];
  const recentRequests = userRequests.filter(time => now - time < windowMs);

  if (recentRequests.length >= limit) {
    const oldestRequest = recentRequests[0];
    const timeUntilReset = Math.ceil((windowMs - (now - oldestRequest)) / 1000);
    return { allowed: false, retryAfter: timeUntilReset };
  }

  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  return { allowed: true };
}

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

  const { profile, education, experience, projects, skills, languages } = cvData;

  let text = `PROFILE:\nName: ${profile.name}\nTitle: ${profile.title}\n`;
  text += `Birthdate: ${profile.birthdate}\n`;
  text += `Contact: Phone: ${profile.contact.phone}, Email: ${profile.contact.email}, GitHub: ${profile.contact.github}, LinkedIn: ${profile.contact.linkedin}, Portfolio: ${profile.contact.portfolio}\n\n`;

  text += "EDUCATION:\n";
  education.forEach((edu) => {
    text += `- ${edu.degree} at ${edu.institution} (${edu.start_date || "N/A"} - ${edu.end_date || "N/A"})\n`;
  });

  text += "\nEXPERIENCE:\n";
  experience.forEach((exp) => {
    text += `- ${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date || "Current"})\nResponsibilities:\n  ${exp.responsibilities.join("\n  ")}\n\n`;
  });

  text += "PROJECTS:\n";
  projects.forEach((project) => {
    text += `- ${project.name} (${project.start_date} - ${project.end_date || "Current"}): ${project.description}\nTechnologies: ${project.technologies.join(", ")}\nWebsite: ${project.website || "N/A"}\n\n`;
  });

  text += "SKILLS:\n";
  text += `- Programming Languages: ${skills.programming_languages.join(", ")}\n`;
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

// Check for API key at module load (only in development)
if (!process.env.GROQ_API_KEY && process.env.NODE_ENV === 'development') {
  console.warn("⚠️ GROQ_API_KEY environment variable is not set!");
}

const cvData = loadCVData();
const formattedCVText = formatCVDataAsText(cvData);

// Initialize Groq client
let groq;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// API handler with Groq SDK
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  const { userId, message } = req.body;

  // Validate input parameters
  if (!userId || typeof userId !== 'string' || userId.length > 100) {
    return res.status(400).json({ error: "Valid userId is required (max 100 characters)." });
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: "Valid message is required." });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: "Message is too long (max 2000 characters)." });
  }

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY || !groq) {
    return res.status(500).json({ 
      error: "API configuration error. Service is not properly configured." 
    });
  }

  // Rate limiting: 10 requests per minute per user
  const identifier = userId || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous';
  const rateLimitResult = rateLimit(identifier, 10, 60000);

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      error: `Too many requests. Please wait ${rateLimitResult.retryAfter} seconds before trying again.`,
      retryAfter: rateLimitResult.retryAfter
    });
  }

  try {
    console.log("User message:", message.substring(0, 100) + (message.length > 100 ? '...' : ''));

    // System prompt with CV data
    const systemPrompt = `You are Achraf Zarouki, a skilled software engineer. Respond to user queries accurately and concisely. Below is your professional CV:

${formattedCVText}

Rules for answers:
- For personal questions like "What is your phone number?", use the CV data.
- If the data is not available in the CV, respond: "Sorry, I can't answer that."
- Be conversational and helpful.`;

    // Use Groq SDK to generate chat completion
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile", // Fast and capable model
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
    });

    // Extract the response text
    const assistantResponse = chatCompletion.choices[0]?.message?.content?.trim() || 
      "I'm not sure how to respond to that. Could you rephrase your question?";

    console.log("Assistant response:", assistantResponse.substring(0, 100) + (assistantResponse.length > 100 ? '...' : ''));

    return res.status(200).json({
      message: assistantResponse,
      tokensUsed: chatCompletion.usage?.total_tokens || null
    });

  } catch (error) {
    console.error("Error processing AI request:", error);

    // Handle specific error types
    if (error.message?.includes('quota') || error.message?.includes('429') || error.status === 429) {
      return res.status(429).json({
        error: "AI service quota exceeded. Please try again later.",
        retryAfter: 60
      });
    }

    if (error.message?.includes('API key') || error.message?.includes('401') || error.status === 401) {
      return res.status(500).json({
        error: "API configuration error. Please check your API key."
      });
    }

    // Handle network errors
    if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: "Unable to connect to AI service. Please try again later.",
        retryAfter: 10
      });
    }

    return res.status(500).json({
      error: "Failed to process the AI request.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}