import fs from "fs";
import path from "path";

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

// Check for API key at module load
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.error("⚠️  GOOGLE_GEMINI_API_KEY environment variable is not set!");
}

const cvData = loadCVData();
const formattedCVText = formatCVDataAsText(cvData);

// API handler with Google Gemini
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
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
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
    const systemPrompt = `You are Achraf Zarouki, a skilled software engineer. Respond to user queries accurately and concisely. 
Below is your professional CV:

${formattedCVText}

Rules for answers:

- For personal questions like "What is your phone number?", use the CV data.
- If the data is not available in the CV, respond: "Sorry, I can't answer that."
- Do not include prefixes like "Assistant:" in your response.`;

    // Combine system prompt and user message for Gemini
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    // Use Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
            topP: 0.8,
            topK: 40,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google Gemini API error:", response.status, errorData);
      
      // Handle rate limiting
      if (response.status === 429) {
        return res.status(429).json({ 
          error: "AI service is temporarily busy. Please try again in a few seconds.",
          retryAfter: 5
        });
      }
      
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        return res.status(500).json({ 
          error: "API configuration error. Please check your API key." 
        });
      }
      
      // Handle quota exceeded
      if (response.status === 400 && errorData.error?.message?.includes('quota')) {
        return res.status(503).json({ 
          error: "Service quota exceeded. Please try again later.",
          retryAfter: 60
        });
      }
      
      throw new Error(`Google Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected Gemini response format:", JSON.stringify(data, null, 2));
      
      // Check if content was blocked by safety filters
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        return res.status(400).json({ 
          error: "Your message was flagged by safety filters. Please rephrase your question." 
        });
      }
      
      return res.status(500).json({ 
        error: "Received unexpected response from AI service." 
      });
    }
    
    // Extract and clean response from Gemini
    let assistantResponse = data.candidates[0].content.parts[0].text;
    
    // Remove common prefixes that might appear
    assistantResponse = assistantResponse
      .replace(/^Assistant:\s*/i, '')
      .replace(/^Response:\s*/i, '')
      .trim();
    
    // Fallback if response is empty
    if (!assistantResponse) {
      assistantResponse = "I'm not sure how to respond to that. Could you rephrase your question?";
    }

    console.log("Assistant response:", assistantResponse.substring(0, 100) + (assistantResponse.length > 100 ? '...' : ''));

    return res.status(200).json({ 
      message: assistantResponse,
      tokensUsed: data.usageMetadata?.totalTokenCount || null
    });
  } catch (error) {
    console.error("Error processing AI request:", error);
    
    // Handle network errors
    if (error.message.includes('fetch') || error.code === 'ECONNREFUSED') {
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