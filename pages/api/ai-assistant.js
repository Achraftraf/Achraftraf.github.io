import fs from "fs";
import path from "path";

// Simple in-memory rate limiter
const rateLimitMap = new Map();

function rateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Remove old requests outside the window
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

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimitMap.entries()) {
    const recentRequests = requests.filter(time => now - time < 60000);
    if (recentRequests.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recentRequests);
    }
  }
}, 300000);

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
  text += `Birthdate: ${profile.birthdate}\n`;
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

// API handler with rate limiting and better error handling
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  const { userId, message } = req.body;

  if (!userId || !message) {
    return res
      .status(400)
      .json({ error: "userId and message are required." });
  }

  // Rate limiting: 10 requests per minute per user
  const identifier = userId || req.headers['x-forwarded-for'] || 'anonymous';
  const rateLimitResult = rateLimit(identifier, 10, 60000);
  
  if (!rateLimitResult.allowed) {
    return res.status(429).json({ 
      error: `Too many requests. Please wait ${rateLimitResult.retryAfter} seconds before trying again.`,
      retryAfter: rateLimitResult.retryAfter 
    });
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

    // Use OpenRouter API with fetch
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.YOUR_SITE_NAME || "CV Assistant",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", response.status, errorData);
      
      // Handle rate limiting from OpenRouter
      if (response.status === 429) {
        return res.status(429).json({ 
          error: "AI service is temporarily busy. Please try again in a few seconds.",
          retryAfter: 5,
          isOpenRouterLimit: true
        });
      }
      
      // Handle other API errors
      if (response.status === 401) {
        return res.status(500).json({ 
          error: "API configuration error. Please contact support." 
        });
      }
      
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse =
      data.choices[0]?.message?.content ||
      "Oops, it seems I've hit a blank. Let's try that again?";

    console.log("Assistant response:", assistantResponse);

    return res.status(200).json({ message: assistantResponse });
  } catch (error) {
    console.error("Error processing AI response:", error);
    return res
      .status(500)
      .json({ 
        error: "Failed to process the AI request.",
        message: error.message 
      });
  }
}