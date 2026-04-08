import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyPlaceholder",
);

/**
 * Generate item name and description from a prompt/image context
 */
export const generateItemDetails = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const fullPrompt = `Based on the following description of a lost item, generate a professional, concise item name and a detailed description. Format the output as a JSON object with 'name' and 'description' keys. Item summary: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (e) {
    console.error("AI generateItemDetails failed:", e.message);
    // Fallback if model fails or returns invalid JSON
    return {
      name: "Reported Item",
      description: prompt || "A discovered item requiring owner verification.",
    };
  }
};

/**
 * Classify a message as SAFE or SPAM
 */
export const classifyMessage = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Classify this message for a lost-and-found system as 'SAFE' or 'SPAM'. Reasons for SPAM: links to external sites, requests for money, suspicious code, or offensive language. 
    Message: "${message}" 
    Return only the word 'SAFE' or 'SPAM'.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const verdict = response.text().trim().toUpperCase();

    return verdict === "SPAM" ? "SPAM" : "SAFE";
  } catch (e) {
    console.error("AI classifyMessage failed:", e.message);
    // Default to SAFE if AI is unavailable to prevent blocking communications
    return "SAFE";
  }
};

/**
 * Suggest a polite reply for the owner
 */
export const suggestReply = async (finderName, messageText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `A finder named ${finderName} sent this message: "${messageText}". Suggest a grateful, polite, and safe reply for the owner of the item to send back. Keep it short.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (e) {
    console.error("AI suggestReply failed:", e.message);
    return "Thank you for finding my item and reaching out!";
  }
};

/**
 * Generate a polite finder message
 */
export const generateFinderMessage = async (itemName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `I found a lost item: "${itemName}". Help me write a polite, helpful message to the owner letting them know I have it and want to return it safely.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (e) {
    console.error("AI generateFinderMessage failed:", e.message);
    return `Hi, I have found your ${itemName}. I'd like to return it to you safely.`;
  }
};
