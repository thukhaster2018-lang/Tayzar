
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import type { PatientDataSchema, ChatMessage as AppChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: SYSTEM_PROMPT,
  },
});

export const getChatbotResponse = async (
  prompt: string,
  history: AppChatMessage[]
): Promise<{ patientMessage: string; jsonData: PatientDataSchema }> => {
  try {
    const geminiHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: msg.sender === 'user' 
            ? msg.userText || '' 
            : msg.botResponse?.patientMessage || '',
    }));
    
    // @ts-ignore
    const result = await model.sendMessage({ message: prompt, history: geminiHistory });
    const responseText = result.text;

    // --- Response Parsing Logic ---
    const jsonMarker = "B) JSON";
    const parts = responseText.split(jsonMarker);

    if (parts.length < 2) {
      // Fallback if the format is not perfect
      console.warn("AI response format is not as expected. Trying to find JSON within the text.");
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = responseText.match(jsonRegex);
      if (match && match[1]) {
        const patientMessage = responseText.split("```json")[0].trim();
        const jsonData = JSON.parse(match[1]);
        return { patientMessage, jsonData };
      }
      throw new Error("Invalid response format from AI. Could not find JSON block.");
    }
    
    const patientMessage = parts[0].replace("A) Patient Message", "").trim();
    const jsonString = parts[1].trim();

    // Clean up potential markdown code block fences
    const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '').trim();

    const jsonData = JSON.parse(cleanedJsonString);

    return { patientMessage, jsonData };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get response from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};
