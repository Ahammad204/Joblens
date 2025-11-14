/* eslint-disable no-unused-vars */
// import { GoogleGenerativeAI } from "@google/generative-ai";

// fallback keyword dictionary  
const DICTIONARY = {
  skills: ["javascript", "react", "node", "express", "mongodb", "css", "html", "python", "java"],
  tools: ["git", "github", "vs code", "postman", "figma", "webpack", "vscode"],
  roles: ["frontend developer", "backend developer", "full stack developer", "data analyst", "ui designer"]
};

export const extractFromDictionary = (text) => {
  const lower = text.toLowerCase();

  return {
    skills: DICTIONARY.skills.filter(s => lower.includes(s)),
    tools: DICTIONARY.tools.filter(t => lower.includes(t)),
    roles: DICTIONARY.roles.filter(r => lower.includes(r)),
  };
};

// export const extractUsingGemini = async (text) => {
//   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//   });

//   const prompt = `
// Extract the following clearly and strictly from this CV:
// 1. Key skills
// 2. Tools / technologies
// 3. Relevant roles/domains
// Return ONLY JSON with keys: skills, tools, roles.

// CV:
// ${text}
// `;

//   try {
//     const result = await model.generateContent(prompt);

//     // Correct text extraction for 2025 Gemini SDK
//     const rawText =
//       result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     if (!rawText.trim()) {
//       console.warn("Gemini returned empty or whitespace text.");
//       return null;
//     }

//     let jsonString = rawText.trim();

//     // Handle ```json block
//     if (jsonString.startsWith("```json")) {
//       jsonString = jsonString.replace(/```json|```/g, "").trim();
//     }

//     return JSON.parse(jsonString);
//   } catch (err) {
//     console.error("Gemini Error:", err);
//     return null;
//   }
// };

export const analyzeCV = async (cvText) => {
  if (!cvText) {
    return { skills: [], tools: [], roles: [], explain: "No CV text provided." };
  }

  try {
    const response = await fetch("http://localhost:5000/api/cv/analyze", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cvText }),
    });

    const data = await response.json();
    console.log(data.data);

    if (data.data) {
      return {
        skills: data.data.skills || [],
        tools: data.data.tools || [],
        roles: data.data.roles || [],
        explain: "Extracted using OpenRouter (kat-coder-pro).",
      };
    } else {
      return {
        skills: [],
        tools: [],
        roles: [],
        explain: data.error || "Failed to extract using OpenRouter.",
      };
    }
  } catch (err) {
    console.error("CV Analysis Error:", err);
    return {
      skills: [],
      tools: [],
      roles: [],
      explain: "Error calling backend CV analysis.",
    };
  }
};

 
