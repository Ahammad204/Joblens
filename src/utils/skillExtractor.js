import axiosPublic from "./axiosPublic";


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

export const analyzeCV = async (cvText) => {
  if (!cvText) {
    return { skills: [], tools: [], roles: [], explain: "No CV text provided." };
  }

  
  try {
    const { data } = await axiosPublic.post("/api/cv/analyze", { cvText }, {
      withCredentials: true,
    });

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
